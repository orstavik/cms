function one(context){
  return context.next();
}

function two(context){
  return new Response("hello server sunshine");
}

export const onRequest = [one, two];