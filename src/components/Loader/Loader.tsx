import PulseLoader from 'react-spinners/PulseLoader';

const style = {
  margin: 'auto',
};

const Loader = (props?: { color?: string }) => {
  return (
    <PulseLoader
      {...props}
      style={style}
    />
  );
};

export default Loader;
