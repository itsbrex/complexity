Refactor the following code focusing on:

1. **Clarity**

- Clear, self-documenting code
- Meaningful identifiers
- Simple logic flows

Example:
```ts
// Before
const fn = (d: Date, n: number) => {
  return d.getTime() + (n * 24 * 60 * 60 * 1000);
}

// After
const addDaysToDate = (date: Date, days: number) => {
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
  return date.getTime() + (days * MILLISECONDS_PER_DAY);
}
```

2. **Structure**

- Modular design
- Clean interfaces
- Framework-agnostic core logic

Example:
```ts
// Before
const UserProfile = () => {
  const [data, setData] = useState<any>();
  
  useEffect(() => {
    fetch('/api/user/123')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{data?.name}</div>;
}

// After
type User = {
  id: string;
  name: string;
}

const useUser = (id: string) => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  return user;
}

const UserProfile = ({ id }: { id: string }) => {
  const user = useUser(id);
  return <div>{user?.name}</div>;
}
```

3. **Practicality**

- Minimal abstractions
- Strategic code reuse
- Domain-driven design

Example:
```ts
// Before: Over-abstracted
class BaseEntity {
  save() { /* ... */ }
  delete() { /* ... */ }
  validate() { /* ... */ }
}

class UserValidator {
  validateEmail() { /* ... */ }
  validateName() { /* ... */ }
}

class User extends BaseEntity {
  validator = new UserValidator();
  // More complexity...
}

// After: Practical composition
type User = {
  email: string;
  name: string;
}

const userValidation = {
  email: (email: string) => email.includes('@'),
  name: (name: string) => name.length >= 2
};

const createUser = (data: User) => {
  if (!userValidation.email(data.email)) {
    throw new Error('Invalid email');
  }
  return data;
}
```

Evaluate changes based on:

- Readability
- Maintainability
- Technical debt
