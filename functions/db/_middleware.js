function one(context){
  return context.next();
}

import {two} from "./code.js";
export const onRequest = [one, two];