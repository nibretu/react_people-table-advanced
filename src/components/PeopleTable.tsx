import { Link, useLocation } from 'react-router-dom';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
}

export const PeopleTable = ({ people }: Props) => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "/people/emma-de-milliano-1876" -> "emma-de-milliano-1876")
  // If we are just on "/people", this will be an empty string.
  const currentSlug = location.pathname.split('/people/')[1] || '';

  // Helper to generate the exact slug expected by the tests
  const getSlug = (person: Person) => {
    return `${person.name.toLowerCase().replace(/\s+/g, '-')}-${person.born}`;
  };

  // Helper to find the slug of a parent if they exist in the current people list
  const findParentSlug = (name: string | null | undefined) => {
    if (!name) {
      return null;
    }

    const foundPerson = people.find(p => p.name === name);

    return foundPerson ? getSlug(foundPerson) : null;
  };

  return (
    <table
      data-cy="peopleTable"
      className="table is-fullwidth is-striped is-hoverable"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Sex</th>
          <th>Born</th>
          <th>Died</th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>
      <tbody>
        {people.map(person => {
          const personSlug = getSlug(person);
          // Check if this row's person matches the current URL slug
          const isSelected = personSlug === currentSlug;

          const motherSlug = findParentSlug(person.motherName);
          const fatherSlug = findParentSlug(person.fatherName);

          return (
            <tr
              key={person.name}
              data-cy="person"
              // 1. Highlight the row if it matches the URL
              className={isSelected ? 'has-background-warning' : ''}
            >
              <td>
                {/* 2. Add has-text-danger for women ('f') */}
                <Link
                  to={`/people/${personSlug}`}
                  className={person.sex === 'f' ? 'has-text-danger' : ''}
                >
                  {person.name}
                </Link>
              </td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>
              <td>
                {/* 3. Render Mother link if she exists in the table */}
                {person.motherName ? (
                  motherSlug ? (
                    <Link
                      to={`/people/${motherSlug}`}
                      className="has-text-danger"
                    >
                      {person.motherName}
                    </Link>
                  ) : (
                    person.motherName
                  )
                ) : (
                  '-'
                )}
              </td>
              <td>
                {/* 4. Render Father link if he exists in the table */}
                {person.fatherName ? (
                  fatherSlug ? (
                    <Link to={`/people/${fatherSlug}`}>
                      {person.fatherName}
                    </Link>
                  ) : (
                    person.fatherName
                  )
                ) : (
                  '-'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
