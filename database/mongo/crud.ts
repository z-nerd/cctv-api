import {
    AggregateOptions,
    Collection,
    DeleteOptions,
    Document,
    Filter,
    FindOptions,
    InsertOneOptions,
    MongoClient,
    InsertOneModel,
    UpdateFilter,
    UpdateOptions,
OptionalUnlessRequiredId,
} from "mongo"
import { TRequireOne } from "../../utils/type.ts"


export class Crud<T extends Document>{
    collection: Collection<T>

    constructor(client: MongoClient,
        dbName: string,
        colName: string) {
        this.collection = client.db(dbName).collection<T>(colName)
    }


    create = async (
        document: OptionalUnlessRequiredId<T>,
        options?: InsertOneOptions|undefined,
    ) => {
        return await this.collection.insertOne(document, options)
    }


    find = async (
        filter: Filter<T>,
        options?: FindOptions,
    ) => {
        return await this.collection.findOne(filter, {
            noCursorTimeout: false,
            ...options,
        })
    }


    findAll = async (
        filter: Filter<T>,
        skip = 0,
        limit = 10,
        sort?: TRequireOne<Partial<{ [K in keyof T]: number }>>,
        options?: AggregateOptions,
    ) => {
        let count = 0
        let data = [] as T[]

        const result = await this.collection.aggregate([
            { $match: filter as Document },
            { $sort: sort ?? { _id: 1 } },
            {
                $facet: {
                    metadata: [
                        { $count: 'count' },
                    ],
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                },
            },
        ], options).toArray()


        if (result.length > 0 &&
            result[0].data.length > 0) {
            count = result[0].metadata[0]?.count ?? 0
            data = result[0].data
        }


        return { skip, limit, count, data }
    }


    delete = async (
        filter: Filter<T & Document>,
        options?: DeleteOptions,
    ) => {
        return await this.collection.deleteOne(filter, options)
    }


    update = async (
        filter: Filter<T>,
        update: UpdateFilter<T>,
        options?: UpdateOptions
    ) => {
        return await this.collection.updateOne(filter, update, options)
    }


    // createIndex = async (
    //     // indexSpec: TRequireOne<Partial<{ [K in keyof T]: number }>>,
    //     options: CreateIndexOptions,
    // ) => {
    //     return await this.collection.createIndexes(options)
    //     // createIndex(indexSpec as IndexSpecification, options)
    // }
}