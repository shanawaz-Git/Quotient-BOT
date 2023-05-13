"use Strict";

require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const axios = require("axios");
const { quotes } = require("./quotesAPI");
const { randomHashtag } = require("./hashtags");

exports.igImageUpload = async () => {
  var res = {};
  try {
    var quote;
    var quoteRes = quotes();
    await quoteRes.then(function (result) {
      quote = result.quote[0];
    });
    var quoteToInsta = quote.quote + "\n-" + quote.author;
    const text = quoteToInsta;
    var caption =
      "Your views about this Post..?\n.\nThe comment section is yours!!\n.\nI post QUOTES daily\n.\n.\n.\nfollow\n@wisequotient\n@wisequotient\n@wisequotient\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#wisequotient ";
    var captionWithHashTag = caption + randomHashtag();
    //-----------------------------------------------------------------------
    const imageBuffer = await axios.get(
      `https://web-series-quotes-api.deta.dev/pic/custom?text=${text}&background_color="white"&text_color="black"&text_size=50&x=1080&y=1080`,
      { responseType: "arraybuffer" }
    );
    // res = instaClient(imageBuffer, captionWithHashTag);
    // console.log("invoking instaclient");
    res = {
      code: 200,
      status: "Success",
      message: "Publishing initialized",
      imageBuffer: imageBuffer.data,
      captionWithHashTag: captionWithHashTag,
    };
  } catch (error) {
    res = {
      code: 403,
      status: "Failure",
      message: `Something went wrong!\nerror: ${error}`,
    };
  }
  return res;
};

// function getTextHeight(text, context, maxWidth) {
//   const words = text.split(" ");
//   let line = "";
//   let lines = 1;
//   const lineHeight = context.measureText("M").width * 1.2;
//   for (let n = 0; n < words.length; n++) {
//     const testLine = line + words[n] + " ";
//     const metrics = context.measureText(testLine);
//     const testWidth = metrics.width;
//     if (testWidth > maxWidth && n > 0) {
//       line = words[n] + " ";
//       lines++;
//     } else {
//       line = testLine;
//     }
//   }
//   return lines * lineHeight;
// }

// const getRandomImage = async () => {
//   const accessKey = "M0Wo-e_TdXprLnmMFL78baXWARNwe49Wr3qQMf2lZoY"; // replace with your own Unsplash access key
//   const randomUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;
//   const response = await axios.get(randomUrl);
//   // console.log(response.data.urls);
//   return response.data.urls.regular;
// };

exports.instaClient = async (imageBuffer, captionWithHashTag) => {
  console.log("invoked instaclient");
  res = {};
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.UNAME);
  await ig.account
    .login(process.env.UNAME, process.env.PASSWORD)
    .then(async () => {
      await ig.publish
        .photo({
          file: imageBuffer,
          caption: captionWithHashTag,
        })
        .then((res) => {
          console.log("after publish to IG --> status:" + res.status);
        });
    });
};
