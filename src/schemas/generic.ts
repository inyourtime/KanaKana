import { type SchemaOptions, type Static, type TSchema, Type } from '@sinclair/typebox'

export function Nullable<T extends TSchema>(T: T) {
  return Type.Union([T, Type.Null()])
}

export function UnsafeRef<T extends TSchema>(T: T, options?: SchemaOptions) {
  return Type.Unsafe<Static<T>>(Type.Ref(T.$id!, options))
}
