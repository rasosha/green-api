import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main>
      <p>404</p>
      <p>page not found</p>
      <span>
        return to <Link to="/">Start Page</Link>
      </span>
    </main>
  );
};

export default NotFoundPage;
