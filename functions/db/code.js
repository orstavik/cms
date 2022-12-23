// Decodes the base64 value and performs unicode normalization.
// @see https://datatracker.ietf.org/doc/html/rfc7613#section-3.3.2 (and #section-4.2.2)
// @see https://dev.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
function decodeAtobUnicode(base64) {
  const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new TextDecoder().decode(buffer).normalize();
}

function basicAuthentication(request) {
  const Authorization = request.headers.get('Authorization');
  if (!Authorization)
    throw new Error('Missing Authorization header.');
  if (!Authorization.startsWith("Basic "))
    throw new Error('Malformed authorization header.');
  const decoded = decodeAtobUnicode(Authorization.substring(6));
  if (/[\0-\x1F\x7F]/.test(decoded))
    throw new Error('Invalid Authorization header value.');
  const [user, pass] = decoded.split(":");
  if (!user || !pass)
    throw new Error('Invalid Authorization header value.');
  return {user, pass};
}

export async function auth(context) {
  try {
//    const {user, pass} = basicAuthentication(context.request);
    const x = await context.env.USER.put("bob", `{"pass":"alice","name": "test user on the server","rights": ["/db"]}`);
    const data = await context.env.USER.list();
    if (data.pass !== pass)
      throw new Error("illegal password");
    if(data.rights.indexOf(context.functionPath) < 0)
      throw new Error("not enough rights");
//    context.user = user;
    context.data = data;
    context.next();
  } catch (error) {
    return new Response("log in", {status: 401});
  }
}

export function two(context) {
  return new Response("hello server sunshine");
}

export function one(context) {
  try{
  const a = basicAuthentication(context);
  console.log(a);
  } catch(error){
    //nothing
  }
  return context.next();
}

export async function three(context){
  const response = await context.next();
  response.headers.set("x-ivar", context.request.url);
  return response;
}