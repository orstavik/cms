class FetchError extends Error{
  constructor(response) {
    super(response.statusText);
    this.response = response;
  }
}

async function fetch2xx(...args){
  const resp = await fetch(...args);
  if(resp.status >= 200 && resp.status < 300)
    return resp;
  throw new FetchError(resp);
}

export async function fetchGet(e, prefix) {
  return await (await fetch2xx(`/${prefix}`)).text();
}