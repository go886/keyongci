const db = {

}

db.prototype = {
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
    async indexingForKey(k, o, remove = false) {
        if (this.props.indexOf(k) > -1) {
            const v = o[k]
            if (v) {
                var prefixe_name = [SEP + this.name, [k, v].join(INDEX_SEP), o.id].join(SEP)
                remove ? await db.del(prefixe_name) : await db.put(prefixe_name, { value: o.id })
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
        return (await db.del(this.key(this.decode(id))) ? null : id)
    },
    async update(o) {
        if (o.id) {
            let item = await this.get(o.id)
            if (item) {
                o && Object.keys(o).forEach(k => {
                    if (['id', '_k', 'add_time', 'edit_time'].indexOf(k) == -1) {
                        this.indexingForKey(k, item)
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
            return await db.get(this.key(this.decode(id)))
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
            db.createReadStream(options)
                .on('data', (data) => {
                    if (list.length < limit) {
                        var v = data.value;
                        var bfind = true;
                        for (var i = 0; i < keys.length; ++i) {
                            if (query[keys[i]] !== v[keys[i]]) {
                                bfind = false;
                                break;
                            }
                        }

                        if (bfind) {
                            list.push(v)

                        }
                    }
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                })
                .on('end', function () {
                    resolve(list)
                });
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
                db.createReadStream(options)
                    .on('data', (data) => {
                        const key = data.substr(data.lastIndexOf(SEP) + 1);
                        if (!indexs || indexs.indexOf(key) > -1) {
                            list.push(key)
                        }
                    })
                    .on('error', function (err) {
                        reject(err)
                    })
                    .on('close', function () {
                    })
                    .on('end', function () {
                        resolve(list)
                    });
            });
        }

        let indexs = []
        if (op.query && Object.keys(op.query).length > 0) {
            Object.keys(op.query).forEach(k => {
                if (op.query[k]) {
                    if (this.props && this.props.indexOf(k) > -1) {
                        indexs.push([SEP + this.name, [k, op.query[k]].join(INDEX_SEP)].join(SEP))
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
            if (options.reverse == true) {
                options.start = prefix_end
                options.end = prefix
            }

            if (op.cursor) {
                const cursor = this.key(this.decode(op.cursor))
                options.reverse == true ? options.lt = cursor : options.gt = cursor;
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
        return { total, list, page }
    },

    async view() {





        // for (var itor = db.iterator(); !itor.end(); itor.next()) {
        //     console.log('a')
        // }

        return new Promise((resolve, reject) => {
            var list = []
            db.createReadStream()
                .on('data', (data) => {
                    data.value = data.value
                    list.push(data)
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                })
                .on('end', function () {
                    resolve({ list })
                });
        });
    }
}