export function doSomething(someString) {
  return `${someString} and more`;
}

export async function doSomethingAsync(someString) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(`async ${someString} and more`);
    }, 1000);
  });
}
