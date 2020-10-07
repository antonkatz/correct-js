export type Struct<C extends {}, Ops extends {}> = Partial<C> & Ops & {
    Contents: Partial<C>
}

export interface Factory<C, Ops> {
    (contents: Partial<C>): Partial<C> & Ops
    fromContents(contents: {}): Partial<C> & Ops
    mix<addC, addOps>(defaultContents: {}, operators: {}, initializer: (this: Struct<C, Ops>) => any): Factory<C & addC, Ops & addOps>
}

export function buildFactory<C extends {}, Ops extends {[k: string]: (this: Struct<C, Ops>) => any}>(
    contents: C,
    operations: Ops,
    initializer: (this: Partial<C> & Ops) => any
): Factory<C, Ops>

export function buildStruct()
