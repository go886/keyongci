const level = require('level')
const Hashids = require('hashids');
const hashids = new Hashids('xiami.com', 0, 'abcdefghijklmnopqrstuvwxyz');
const db = level('./db', { valueEncoding: "json" })
const INIT_INDEX = 1000000000000;
const MAX_LIMIT = 1000;
const SEP = '.'
const INDEX_SEP = ':'
const SEP_NEXT = String.fromCharCode(SEP[0].charCodeAt() + 1)


function model(name, props = null, usekey = false) {
    this.name = name
    this.id = INIT_INDEX;
    this.props = props;
    this.usekey = usekey;
    return this;
}

model.prototype = {
    key(id) {
        return [this.name, id].join(SEP)
    },
    sub(name, usekey = false) {
        return new model([this.name || '', name].join(SEP), usekey);
    },
    encode(id) {
        return this.usekey ? hashids.encode(id) : id;
    },
    decode(id) {
        return this.usekey ? hashids.decode(id) : id;
    },
    iterator(op, cb) {
        op = op || {}
        if (op.keys == false && op.keys == op.values) {
            console.error('keys & values are false')
        }

        if (op.reverse == true) {
            let tmp = op.start
            op.start = op.end
            op.end = tmp

            tmp = op.gte
            op.gte = op.lte
            op.lte = tmp

            tmp = op.gt
            op.gt = op.lt
            op.lt = tmp
        }

        const it = db.iterator(op)
        const next = (err, key, value) => {
            if (err || !key) {
                it.end(() => {
                });
                if (err) console.error(err);
                cb(null, value);
            } else {
                if (cb(key, value) == false) {
                    it.end(() => {
                    });
                    cb(null, null);
                } else {
                    it.next(next);
                }
            }
        }
        it.next(next)
    },
    async indexingForKey(k, o, remove = false) {
        if (this.props && this.props.indexOf(k) > -1) {
            let value = o[k]
            if (value) {
                if (!Array.isArray(value)) {
                    value = [value]
                }
                for (let i = 0; i < value.length; ++i) {
                    const v = value[i]
                    var prefixe_name = [SEP + this.name, [k, v].join(INDEX_SEP), o.id].join(SEP)
                    remove ? await db.del(prefixe_name) : await db.put(prefixe_name, { value: o.id })
                }
            }
        }
    },
    async indexing(o, remove = false) {
        if (this.props) {
            for (let i = 0; i < this.props.length; ++i) {
                await this.indexingForKey(this.props[i], o, remove)
            }
        }
    },
    async add(o) {
        if (!o.id) {
            if (this.id == INIT_INDEX) {
                const last = await this.last()
                if (last && last.id) {
                    this.id = last.id
                }
            }
            this.id += 1;
            o.id = this.id
        }
        o.add_time = (new Date).getTime()
        o.edit_time = o.add_time
        if (this.usekey) o._k = this.encode(o.id)

        await this.indexing(o)
        return (await (db.put(this.key(o.id), o))) ? null : o.id
    },
    async remove(id) {
        if (this.props) {
            const item = await this.get(id)
            await this.indexing(item, true)
        }
        return (await db.del(this.key(id)) ? null : id)
    },
    async update(o) {
        if (o.id) {
            let item = await this.get(o.id)
            if (item) {
                o && Object.keys(o).forEach(k => {
                    if (['id', '_k', 'add_time', 'edit_time'].indexOf(k) == -1) {
                        this.indexingForKey(k, item, true)
                        item[k] = o[k]
                        this.indexingForKey(k, item)
                    }
                });

                item.edit_time = (new Date).getTime()
                return (await (db.put(this.key(item.id), item))) ? null : item.id
            }
        }
    },
    async get(id) {
        try {
            return await db.get(this.key(id))
        } catch (error) {
            return null;
        }
    },
    async next(id, op = {}) {
        op.cursor = id
        if (!op.limit) op.limit = 1;
        const r = await this.search(op)
        return r.list.length > 0 ? r.list[0] : null
    },
    async prev(id, op = {}) {
        op.des = !op.des
        return await this.next(id, op)
    },
    async first(op = {}) {
        return await this.next(null, op)
    },
    async last(op = {}) {
        op.des = !op.des;
        return await this.first(op)
    },
    async count(op = {}) {
        op.values = false
        const r = await this.search(op)
        return r.list.length
    },
    async findOne(query) {
        const list = await this.find(query, 1);
        return list.length > 0 ? list[0] : null
    },

    async find(query, limit = MAX_LIMIT) {
        const prefix = this.name + SEP;
        const prefix_end = this.name + SEP_NEXT;
        let options = {
            limit: MAX_LIMIT,
            reverse: false,
            start: prefix,
            end: prefix_end,
            values: true,
        }
        const keys = Object.keys(query)
        return new Promise((resolve, reject) => {
            let list = []
            this.iterator(options, (key, value) => {
                if (key) {
                    if (list.length < limit) {
                        var bfind = true;
                        for (var i = 0; i < keys.length; ++i) {
                            if (query[keys[i]] !== value[keys[i]]) {
                                bfind = false;
                                break;
                            }
                        }

                        if (bfind) {
                            list.push(value)
                        }
                    }

                    return list.length < limit;
                } else {
                    resolve(list)
                }
            })
        });
    },
    /**
     * 
     * @param {
     * {
            page: 0,  //分页模式
            cursor: null, //游标模式
            limit: 10, // 当为分页模式时，则== pagesize
            des:false, //是否倒序
            values:true, //包含value
            query:{      //查询 目前仅支持 & 操作
                status:0,
                category_name:'net'
            }
        }
     */
    async search(op = {}) {
        const searchimp = async (options, isIndexing = false, indexs = null) => {
            return new Promise((resolve, reject) => {
                let list = []
                this.iterator(options, (key, value) => {
                    if (key) {
                        key = key.substr(key.lastIndexOf(SEP) + 1);
                        if (!indexs || indexs.indexOf(key) > -1) {
                            list.push(key)
                        }
                    } else {
                        resolve(list)
                    }
                });
            });
        }

        let indexs = []
        if (op.query && Object.keys(op.query).length > 0) {
            Object.keys(op.query).forEach(k => {
                let value = op.query[k]
                if (value) {
                    if (this.props && this.props.indexOf(k) > -1) {
                        if (!Array.isArray(value)) value = [value]
                        for (var i = 0; i < value.length; ++i) {
                            indexs.push([SEP + this.name, [k, value[i]].join(INDEX_SEP)].join(SEP))
                        }
                    } else {
                        console.error(k + ' not indexing')
                    }
                }
            });
        }

        if (indexs.length <= 0) {
            indexs.push(this.name)
        }

        let idx = null
        for (var k = 0; k < indexs.length; ++k) {
            const prefix = indexs[k] + SEP;
            const prefix_end = indexs[k] + SEP_NEXT;
            let options = {
                limit: (parseInt(op.limit) || MAX_LIMIT),
                reverse: (op.des == true),
                start: prefix,
                end: prefix_end,
                values: false,
            }

            if (op.cursor) {
                const cursor = [indexs[k], op.cursor].join(SEP)
                options.gt = cursor;
            } else {
                options.limit = MAX_LIMIT;
            }
            idx = await searchimp(options, true, idx)
        }

        const total = idx.length;
        const size = parseInt(op.limit) || MAX_LIMIT;
        const page = (parseInt(op.page) || 1) - 1
        const begin = (page < 0 ? 0 : page) * size;
        const end = begin + size > total ? total : begin + size;
        var list = []
        if (begin < total) {
            if (op.values == false) {
                list = idx.slice(begin, end)
            } else {
                let i = begin;
                while (i < end) {
                    const item = await db.get(this.key(idx[i++]))
                    if (item) list.push(item)
                }
            }
        }
        return { total, list, page: page + 1 }
    },

    async view() {
        return new Promise((resolve, reject) => {
            var list = []
            this.iterator(null, (key, value) => {
                if (key) {
                    list.push({ key, value })
                } else {
                    resolve({ list })
                }
            })
        });
    }
}

module.exports = {
    // idx: new model(''), //indexs
    article: new model('a', ["category_id", "status", "title", "tags"], true), //article
    category: new model('c'),
    user: new model('u'),
    link: new model('l'),
    tag: new model('t'),
    pv: new model('p'),
    kv: (function (m) {
        return {
            async get(k, defaultvalue) {
                let v = await m.get(k)
                return v || defaultvalue;
            },
            async set(id, value) {
                if (!id  || (value && value.id && id !== value.id)) {
                    return {error:'id error'}
                } 
                value.id = id;
                return { id :await m.add(value)}
            }
        }
    })(new model('kv'))
}