export default function unsupported(result: never) {
  return Promise.reject(new Error("Unsupported result", { cause: result }));
}
