exports.getContents = (subtitles) => {
  try {
    subtitles = subtitles.replace(/\n\n\n/g, '\n\n');

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

exports.delMarks = (content) => {
  try {
    if (content.includes('[START]')) {
      content = content.replace(/\[START\]/g, '');
    }
    if (content.includes('[END]')) {
      content = content.replace(/\[END\]/g, '');
    }

    return content;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
