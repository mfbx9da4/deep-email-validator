export {}
declare global {
  interface ObjectConstructor {
    typedKeys<T>(o: T): Array<keyof T>
  }
}
Object.typedKeys = Object.keys as any
