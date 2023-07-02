exports.getContents = (subtitles) => {
  try {
    let subtitlesArray = subtitles.split('\n\n').filter((item) => item.trim() !== '');

    let subtitlesContents = subtitlesArray.map((item) => {
      let parts = item.split('\n');
      let res = parts[0] + '\n' + parts[2] + '\n\n';
      return res;
    });

    return subtitlesContents;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
