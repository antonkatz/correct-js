export type Struct<C extends {}, Ops extends {[k: string]: (this: Struct<C, Ops>, ...rest: any[] | undefined) => any}> = C & Ops & {
    Contents: Partial<C>
}

// type Initializer<This> =

export interface Factory<C, Ops extends {[k: string]: (this: Struct<C, Ops>, ...rest: any[] | undefined) => any}, Ires> {
    (contents: Partial<C>): Ires extends Promise<any> ? Promise<Struct<C, Ops> | undefined> : (Struct<C, Ops> | undefined)
    fromContents(contents: {}): Partial<C> & Ops

    // fixme. addIres in return should be conditional, etc
    mix<addC, addOps, addIres>(defaultContents: {}, operators: {}, initializer: (this: Struct<C, Ops>) => addIres): Factory<C & addC, Ops & addOps, addIres>
}

export function buildFactory<C extends {}, Ops extends {[k: string]: (this: Struct<C, Ops>, ...rest: any[] | undefined) => any}, Ires extends (any | Promise<any>)>(
    contents: C,
    operations: Ops,
    initializer: (this: Struct<C, Ops>) => Ires
): Factory<C, Ops, Ires>

export function buildStruct()
