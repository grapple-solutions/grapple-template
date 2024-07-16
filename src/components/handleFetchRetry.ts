export const handleFetchRetry = async (functionToRetry: Function) => {
    let requestResult: Response = new Response(
      JSON.stringify({ ok: false }), { status: 400 }
    );

    const timesToRetry = 10;
    const retrySchema = {
      // Seconds or minutes
      timeUnit: 's' as 's' | 'm',
      // Function that returns an array of numbers 
      // meaning the time to wait before next fetch
      intervalTime: (
          x: number = 0, 
          y: number = 1, 
        ): number[] => {
        // Fibonacci numbers 1, 2, 3, 5, 8, 13, 21, 34...
        // Must start with 0 to fetch instantly
        let numbers = [0];
        for(let k = 0; k < timesToRetry - 1; k++) {
          numbers.push(x + y);
          let aux = x;
          x = y;
          y = aux + y;
        }
        return numbers;
      } 
    }

    const numbers = retrySchema.intervalTime();

    for(let k = 0; k < numbers.length; k++) {
      const promiseFunction = () => {
        return new Promise((resolve: any) => {
          setTimeout(async () => {
            try {
              requestResult = await functionToRetry();
              if(requestResult.ok) {
                k = numbers.length;
              }
            } catch (error) {
              console.log({ error });
            }
            resolve();
          }, numbers[k] * (retrySchema.timeUnit == 's' ? 1000 : (1000 * 60)));
        });
      }
      await promiseFunction();
    }

    return requestResult;
  } 