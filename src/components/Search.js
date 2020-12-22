import { useEffect, useState } from "react";
import axios from 'axios';

const Search = () =>
{
  const [term, setTerm] = useState('programming');
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [results, setResults] = useState([]);

  useEffect(() =>
  {
    const timerId = setTimeout(() => setDebouncedTerm(term), 500);

    return () => clearTimeout(timerId);
  }, [term]);

  useEffect(() =>
  {
    const search = async () =>
    {
      const { data } = await axios.get('https://en.wikipedia.org/w/api.php',
      {
        params:
        {
          action: 'query',
          origin: '*',
          list: 'search',
          format: 'json',
          srsearch: debouncedTerm
        }
      });

      setResults(data.query.search);
    };

    if (debouncedTerm)
    {
      search();
    }
    else
    {
      setResults([]);
    }
  }, [debouncedTerm]);

  const renderedResults = results.map(result =>
  {
    return (
      <div key={ result.pageid } className="item">
        <div className="right floated content">
          <a href={ `https://en.wikipedia.org?curid=${result.pageid}` } className="ui button" target="_none">Go</a>
        </div>
        <div className="content">
          <div className="header">
            { result.title }
          </div>
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div className="ui container">
      <div className="ui form">
        <div className="field">
          <label>Enter Search Term</label>
          <input className="input" value={ term } onChange={ e => setTerm(e.target.value) } />
        </div>
      </div>
      <div className="ui celled list">
        { renderedResults }
      </div>
    </div>
  );
};

export default Search;
// en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=SEARCHTERM