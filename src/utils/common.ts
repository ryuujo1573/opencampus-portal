type NonEmptyValues<T extends {}> = {
  [key in keyof T]: T[key] extends undefined ? never : T[key];
};

export function pruneObject<T extends {}>(obj: T): NonEmptyValues<T> {
  for (const key in obj) {
    if (obj[key] == null) {
      delete obj[key];
    }
  }
  return obj as unknown as any;
}
