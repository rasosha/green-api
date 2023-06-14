const timeFormat = (time: number | undefined): string => {
  if (time) {
    const hrs = new Date(time * 1000).getHours().toString().padStart(2, '0');
    const min = new Date(time * 1000).getMinutes().toString().padStart(2, '0');
    const sec = new Date(time * 1000).getSeconds().toString().padStart(2, '0');
    return hrs + ':' + min + ':' + sec;
  }
  return '';
};

export default timeFormat;
