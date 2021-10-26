export const c = (cls: string | string[]) => {
  if (Array.isArray(cls)) {
    return cls.join(" ");
  }

  return cls;
}
