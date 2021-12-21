declare global {
  interface ObjectConstructor {
    typedKeys<T>(o: T): Array<keyof T>
  }
}
Object.typedKeys = Object.keys as any

export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never
