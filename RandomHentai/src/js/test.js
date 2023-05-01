const {request} = window.axios
const options = {
    method: 'POST',
    url: 'https://scrapeninja.p.rapidapi.com/scrape',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '79efc015d5msh0299ccd68522a1ap1f0481jsn9a90e910ab18',
      'X-RapidAPI-Host': 'scrapeninja.p.rapidapi.com'
    },
    data: `{"url":"http://nhentai.net/","headers":["X-Header: some-random-header"],"retryNum":1,"geo":"default","followRedirects":0,"timeout":8,"textNotExpected":["random-captcha-text-which-might-appear"],"statusNotExpected":[403,502]}`
  };
  axios.request(options).then(function (response) {
    console.log(response)
  }).catch(function (error) {
    console.error(error);
  });