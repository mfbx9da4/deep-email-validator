declare global {
  interface ObjectConstructor {
    typedKeys<T>(o: T): Array<keyof T>
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.typedKeys = Object.keys as any

export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer E>
  ? E
  : never
