export const quizQuestions = {
  "JavaScript": [
    {
      question: "What is the difference between var, let, and const?",
      options: [
        "var is block-scoped, let and const are function-scoped.",
        "var is function-scoped, let and const are block-scoped. const prevents modification of the identifier's binding, not the value itself.",
        "var and let can be redeclared in the same scope, const cannot.",
        "There is no difference; they are interchangeable."
      ],
      answerIndex: 1
    },
    {
      question: "What is a closure in JavaScript?",
      options: [
        "A mechanism to close a browser window after code execution.",
        "The process of terminating a loop or switch block.",
        "A function bundled together with references to its surrounding state (the lexical environment).",
        "A method of declaring private variables using global functions."
      ],
      answerIndex: 2
    },
    {
      question: "Explain the event loop and how asynchronous code works.",
      options: [
        "It continuously runs synchronous tasks on multiple threads simultaneously.",
        "It monitors the Call Stack and the Callback Queue. If the call stack is empty, it pushes the first task from the queue onto the stack.",
        "It executes all setTimeout functions before any other code is parsed.",
        "It blocks the main execution thread until all asynchronous promises resolve."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between == and ===?",
      options: [
        "== performs loose equality comparison with type coercion; === performs strict equality comparison without type coercion.",
        "== performs strict comparison; === is used only for comparing objects.",
        "== is only used for numbers; === is used for strings and booleans.",
        "They are completely identical in modern JavaScript."
      ],
      answerIndex: 0
    },
    {
      question: "What does Array.prototype.map() return?",
      options: [
        "The first element that matches a specific condition.",
        "A boolean indicating if all elements pass a test.",
        "A new array populated with the results of calling a provided function on every element in the calling array.",
        "Undefined; it modifies the original array in place."
      ],
      answerIndex: 2
    },
    {
      question: "What is a Promise and how does it differ from a callback?",
      options: [
        "A Promise is a synchronous value; a callback is asynchronous.",
        "A Promise represents the eventual completion (or failure) of an asynchronous operation and its resulting value, avoiding 'callback hell'.",
        "A Promise is a function passed as an argument; a callback is an object representing a thread.",
        "A Promise can only run in web workers; callbacks run on the main thread."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between null and undefined?",
      options: [
        "null means a variable is declared but not assigned; undefined is an intentional absence of any value.",
        "null is an object representing the intentional absence of a value; undefined means a variable has been declared but has not yet been assigned a value.",
        "null is a syntax error; undefined is a logical error.",
        "They have the same type and value."
      ],
      answerIndex: 1
    },
    {
      question: "How does prototypal inheritance work?",
      options: [
        "Objects inherit properties and methods directly from other objects through a prototype link.",
        "It copies all properties from a class constructor to a new instance.",
        "It requires a compile-time definition of class hierarchies.",
        "It utilizes multiple inheritance using interfaces and abstract classes."
      ],
      answerIndex: 0
    },
    {
      question: "What is the purpose of async/await?",
      options: [
        "To run JavaScript code on multi-threaded CPU cores.",
        "To block the user interface during database fetches.",
        "To write asynchronous code that looks and behaves like synchronous code, built on top of Promises.",
        "To speed up execution of mathematical calculations."
      ],
      answerIndex: 2
    },
    {
      question: "What is a higher-order function? Give an example.",
      options: [
        "A function that returns a primitive value like a number; e.g., Math.max().",
        "A function that operates on other functions, either by taking them as arguments or by returning them; e.g., Array.prototype.filter().",
        "A function that runs at the highest priority in the event loop; e.g., console.log().",
        "A function nested inside a class method; e.g., getter/setter."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between call(), apply(), and bind()?",
      options: [
        "call() takes arguments as an array, apply() takes comma-separated arguments, bind() executes the function immediately.",
        "call() and apply() execute the function immediately (call takes arguments individually; apply takes them as an array); bind() returns a new function with a bound context to be executed later.",
        "call() binds the context permanently; apply() and bind() are temporary bindings.",
        "They are old syntax and are fully replaced by arrow functions."
      ],
      answerIndex: 1
    },
    {
      question: "What is event delegation and why is it useful?",
      options: [
        "Sending events to a secondary thread to keep the UI responsive.",
        "Attaching a single event listener to a parent element to handle events on its children, improving memory usage and performance.",
        "Removing event listeners dynamically during page transitions.",
        "Using custom events to communicate between separate frontend frameworks."
      ],
      answerIndex: 1
    },
    {
      question: "What does the spread operator (...) do?",
      options: [
        "It spreads elements of an iterable (like an array or object) into individual elements or properties.",
        "It compresses multiple statements into a single line of code.",
        "It increases the memory allocation of an array dynamically.",
        "It splits a string into an array of lines."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between setTimeout and setInterval?",
      options: [
        "setTimeout executes a function once after a delay; setInterval executes a function repeatedly at specified intervals.",
        "setTimeout repeats infinitely; setInterval executes only once.",
        "setTimeout is synchronous; setInterval is asynchronous.",
        "setTimeout executes in the background; setInterval blocks the main thread."
      ],
      answerIndex: 0
    },
    {
      question: "What is a WeakMap and when would you use it?",
      options: [
        "A collection of key/value pairs where keys must be objects and are weakly referenced, allowing garbage collection if no other references exist.",
        "A map with fewer features than a regular Map, used for low-memory environments.",
        "A storage interface used to cache API requests in the browser local storage.",
        "A map where keys can be garbage collected only if they are primitive strings."
      ],
      answerIndex: 0
    }
  ],
  "Python": [
    {
      question: "What is the difference between a list and a tuple?",
      options: [
        "Lists are immutable, tuples are mutable.",
        "Lists are mutable, tuples are immutable.",
        "Lists can store different data types, tuples can only store a single data type.",
        "Lists are defined with parentheses, tuples are defined with brackets."
      ],
      answerIndex: 1
    },
    {
      question: "What are Python decorators and how do they work?",
      options: [
        "Functions that clean up syntax errors during compilation.",
        "Objects that serialize data formats.",
        "Functions that take another function as an argument, extend its behavior without explicitly modifying it, and return a new function.",
        "Design classes used to style terminal output."
      ],
      answerIndex: 2
    },
    {
      question: "Explain the concept of list comprehensions.",
      options: [
        "A way to calculate the space complexity of a list.",
        "A syntactic construct for creating a new list from an existing iterable in a single concise line of code.",
        "A debugging method that prints list contents with types.",
        "A process of indexing nested arrays in multidimensional structures."
      ],
      answerIndex: 1
    },
    {
      question: "What is the GIL (Global Interpreter Lock)?",
      options: [
        "A security constraint that prevents unauthorized file modifications.",
        "A mechanism that blocks access to database queries in multi-tenant apps.",
        "A mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once.",
        "A syntax validator that locks execution when variable naming is inconsistent."
      ],
      answerIndex: 2
    },
    {
      question: "What is the difference between deepcopy and shallow copy?",
      options: [
        "deepcopy creates a new object and recursively copies all nested objects; shallow copy copies the outer object but shares references to nested objects.",
        "deepcopy copies references only; shallow copy copies the values of nested objects.",
        "deepcopy only works for lists; shallow copy works for dicts.",
        "They are exactly the same in Python 3."
      ],
      answerIndex: 0
    },
    {
      question: "How does Python manage memory?",
      options: [
        "Through manual allocation and deallocation using pointers.",
        "Mainly through reference counting and a cyclic garbage collector to clean up reference cycles.",
        "By writing all cache data to disk space automatically.",
        "By clearing all variables from memory every time a function returns."
      ],
      answerIndex: 1
    },
    {
      question: "What is *args and **kwargs?",
      options: [
        "*args passes keyword arguments, **kwargs passes positional arguments.",
        "*args passes a variable number of positional arguments as a tuple, **kwargs passes a variable number of keyword arguments as a dictionary.",
        "They are debugging tools used to log exceptions.",
        "They represent pointers to integer and string structures."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between @staticmethod and @classmethod?",
      options: [
        "@staticmethod passes the class as the first argument, @classmethod passes the instance.",
        "@staticmethod does not receive any implicit first argument, @classmethod receives the class (cls) as its first argument.",
        "@staticmethod is deprecated; @classmethod should always be used.",
        "@staticmethod can only modify class attributes; @classmethod cannot."
      ],
      answerIndex: 1
    },
    {
      question: "How do generators work in Python?",
      options: [
        "They generate random numbers for statistics.",
        "Functions that yield values one at a time using the 'yield' keyword, returning a generator iterator that computes values lazily.",
        "They build HTML files from templates.",
        "They run background subprocesses."
      ],
      answerIndex: 1
    },
    {
      question: "What is a context manager and how do you create one?",
      options: [
        "An object that manages global variables. Created using @global decorator.",
        "A design pattern to handle security authentication. Created using the 'security' keyword.",
        "An object that defines runtime context for 'with' statements using __enter__ and __exit__ methods, or using the @contextmanager decorator.",
        "A package that coordinates pip installations."
      ],
      answerIndex: 2
    },
    {
      question: "What is duck typing?",
      options: [
        "A programming concept where an object's suitability is determined by the presence of certain methods and properties, rather than its inheritance hierarchy.",
        "An error handling practice that ignores type mismatches.",
        "A static typing method introduced in Python 3.10.",
        "A method of declaring polymorphic class functions using abstract models."
      ],
      answerIndex: 0
    },
    {
      question: "How does Python's with statement work?",
      options: [
        "It acts as a loop that repeats if a condition is true.",
        "It simplifies exception handling by encapsulating common preparation and cleanup tasks using context managers.",
        "It imports modules dynamically at runtime.",
        "It binds local variables to a global environment."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between is and ==?",
      options: [
        "is checks value equality, == checks identity (memory location).",
        "is checks identity (whether two references point to the same object in memory), == checks value equality.",
        "They are synonyms and behave identically.",
        "is is only for strings, == is only for numbers."
      ],
      answerIndex: 1
    },
    {
      question: "Explain MRO (Method Resolution Order).",
      options: [
        "The order in which Python searches for a method in a class hierarchy, computed using the C3 Linearization algorithm.",
        "The compilation sequence of code methods.",
        "The execution speed order of recursive functions.",
        "The memory layout of object methods."
      ],
      answerIndex: 0
    },
    {
      question: "What are Python's built-in data structures and their time complexities?",
      options: [
        "list (O(N) lookup), dict (O(1) average lookup), set (O(1) average lookup), tuple (O(N) lookup).",
        "list (O(1) lookup), dict (O(N) lookup), set (O(N) lookup).",
        "All built-in Python structures have O(N log N) lookup complexity.",
        "No built-in structures exist; they must be imported from standard modules."
      ],
      answerIndex: 0
    }
  ],
  "SQL": [
    {
      question: "What is the difference between INNER JOIN and LEFT JOIN?",
      options: [
        "INNER JOIN returns all rows from both tables; LEFT JOIN returns only matches.",
        "INNER JOIN returns rows when there is a match in both tables; LEFT JOIN returns all rows from the left table and matched rows from the right table.",
        "INNER JOIN is faster but doesn't support aggregate functions.",
        "They are identical, but LEFT JOIN is the modern syntax."
      ],
      answerIndex: 1
    },
    {
      question: "What is a primary key vs a foreign key?",
      options: [
        "A primary key uniquely identifies each record in a table; a foreign key links records in one table to the primary key in another table.",
        "A primary key must be a number; a foreign key must be a string.",
        "A table can have multiple primary keys but only one foreign key.",
        "They are two terms for the same concept."
      ],
      answerIndex: 0
    },
    {
      question: "What does GROUP BY do and when is it used?",
      options: [
        "Groups rows that have the same values into summary rows, often used with aggregate functions like COUNT, MAX, MIN, SUM, or AVG.",
        "Sorts the result set in ascending or descending order.",
        "Filters rows based on a specific regex expression.",
        "Locks rows to prevent write access during transactions."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between WHERE and HAVING?",
      options: [
        "WHERE filters rows before groups are formed; HAVING filters groups after GROUP BY is applied.",
        "WHERE is used with GROUP BY; HAVING is used without GROUP BY.",
        "WHERE only supports numbers; HAVING supports string aggregates.",
        "They are fully interchangeable aliases."
      ],
      answerIndex: 0
    },
    {
      question: "What is a subquery?",
      options: [
        "A query nested inside another SELECT, INSERT, UPDATE, or DELETE statement, or inside another subquery.",
        "A backup database instance that mirrors queries.",
        "A query executed on a secondary database server.",
        "A low-priority query that runs in the background."
      ],
      answerIndex: 0
    },
    {
      question: "What is database normalization? Name the normal forms.",
      options: [
        "The process of structuring a database to reduce data redundancy and improve data integrity, through forms like 1NF, 2NF, 3NF, and BCNF.",
        "A method of backing up data formats. Includes forms like Daily, Weekly, and Monthly.",
        "Speeding up queries using indexes. Forms are B-Tree and Hash.",
        "Converting relational tables into JSON columns."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between UNION and UNION ALL?",
      options: [
        "UNION includes duplicate rows; UNION ALL removes duplicate rows.",
        "UNION removes duplicate rows from the combined result set; UNION ALL keeps duplicate rows.",
        "UNION works only on the same table; UNION ALL works across different databases.",
        "UNION is synchronous; UNION ALL is asynchronous."
      ],
      answerIndex: 1
    },
    {
      question: "What is an index and how does it improve performance?",
      options: [
        "A pointer structure that speeds up data retrieval operations on a database table, at the cost of slower writes and additional disk space.",
        "A unique constraint that prevents duplicate data entry.",
        "A caching tool stored in the web client's local storage.",
        "A database column that automatically increments."
      ],
      answerIndex: 0
    },
    {
      question: "What is a transaction and what are ACID properties?",
      options: [
        "A single logical unit of work; ACID properties are Atomicity, Consistency, Isolation, and Durability, ensuring reliability.",
        "A transfer of currency; ACID properties represent security validation codes.",
        "A query that joins more than five tables; ACID stands for Active Column Index Database.",
        "A process of backing up schema layouts."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between DELETE, TRUNCATE, and DROP?",
      options: [
        "DELETE removes rows based on a WHERE clause (can be rolled back); TRUNCATE removes all rows quickly (cannot be rolled back); DROP deletes the table structure entirely.",
        "TRUNCATE deletes the table structure; DROP deletes specific rows.",
        "They are identical commands with different names.",
        "DELETE deletes indexes; TRUNCATE deletes rows; DROP deletes the database."
      ],
      answerIndex: 0
    },
    {
      question: "What is a CTE (Common Table Expression)?",
      options: [
        "A temporary named result set that you can reference within a SELECT, INSERT, UPDATE, or DELETE statement, defined using the 'WITH' clause.",
        "A database table that shares schema details across instances.",
        "A column constraint that checks database type validity.",
        "An index that auto-optimizes slow search algorithms."
      ],
      answerIndex: 0
    },
    {
      question: "What is a window function? Give an example.",
      options: [
        "A function that performs calculations across a set of table rows that are related to the current row, e.g., ROW_NUMBER() OVER (PARTITION BY ...).",
        "A function that opens an external application modal.",
        "A scheduled cron script that triggers database cleanup.",
        "A function that matches query parameters to user settings."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between clustered and non-clustered indexes?",
      options: [
        "Clustered indexes alter the physical order of table rows; non-clustered indexes contain pointers to row locations without reordering table data.",
        "Clustered indexes can exist in multiple forms; non-clustered indexes can only have one index per table.",
        "Clustered indexes are slower; non-clustered indexes are faster for searches.",
        "Clustered indexes are stored in memory; non-clustered indexes are stored on disk."
      ],
      answerIndex: 0
    },
    {
      question: "How does EXPLAIN help in query optimization?",
      options: [
        "It provides execution details of a query plan, showing index usage, join types, and scan levels to help identify performance bottlenecks.",
        "It adds textual comments to explain what a query does.",
        "It auto-corrects bad join structures in queries.",
        "It measures execution duration in milliseconds."
      ],
      answerIndex: 0
    },
    {
      question: "What is the N+1 query problem?",
      options: [
        "A performance issue where an application executes N additional database queries to fetch child data for N records fetched by an initial query.",
        "A syntax limitation where a table cannot have more than N+1 index parameters.",
        "An index scan conflict that causes transactions to lock.",
        "A database backup failure due to mismatched rows."
      ],
      answerIndex: 0
    }
  ],
  "Git": [
    {
      question: "What is the difference between git merge and git rebase?",
      options: [
        "merge preserves project history as is; rebase rewrites project history by placing commits on top of another branch.",
        "merge creates a new commit joining histories; rebase moves/applies commits onto another base, resulting in a linear history.",
        "merge is local; rebase is only used on remote repositories.",
        "They do the exact same thing under the hood."
      ],
      answerIndex: 1
    },
    {
      question: "What does git stash do?",
      options: [
        "It saves changes to the remote branch permanently.",
        "It discards all uncommitted modifications in the workspace.",
        "It temporarily shelves uncommitted changes (tracked and untracked) so you can work on a clean directory, and can be reapplied later.",
        "It deletes empty folders and nested logs."
      ],
      answerIndex: 2
    },
    {
      question: "What is a detached HEAD state?",
      options: [
        "A state when Git is disconnected from the local terminal.",
        "A state when Git points to a specific commit rather than a branch reference.",
        "A state when the remote origin repository is offline.",
        "A git error caused by conflicts in local merges."
      ],
      answerIndex: 1
    },
    {
      question: "How do you undo the last commit without losing changes?",
      options: [
        "git reset --hard HEAD~1",
        "git reset --soft HEAD~1",
        "git checkout HEAD~1",
        "git revert --no-edit"
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between git fetch and git pull?",
      options: [
        "git fetch downloads commits from remote without merging; git pull downloads and immediately merges them into the current branch.",
        "git fetch merges commits automatically; git pull only downloads metadata.",
        "git fetch is unsafe; git pull is safe for all branches.",
        "There is no difference; they are aliases."
      ],
      answerIndex: 0
    },
    {
      question: "What is a .gitignore file?",
      options: [
        "A file listing patterns that Git should intentionally ignore or avoid tracking.",
        "A script that deletes temporary test files.",
        "A config file containing access credentials.",
        "A security log generated by git commit scripts."
      ],
      answerIndex: 0
    },
    {
      question: "How do you resolve a merge conflict?",
      options: [
        "Open the conflicted files, manually choose between changes, edit conflict markers (<<<<, ====, >>>>), save, and commit the resolved files.",
        "Delete the conflicted branch and re-clone the repository.",
        "Run git force-merge to automatically overwrite remote branches.",
        "Git automatically resolves all conflicts at commit time."
      ],
      answerIndex: 0
    },
    {
      question: "What is git cherry-pick?",
      options: [
        "Selecting a specific file to add to the staging index.",
        "Applying the changes introduced by some existing commits onto the current branch.",
        "A search command that scans branch history for changes.",
        "A script that deletes unwanted commits."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between a branch and a tag?",
      options: [
        "A branch is a mutable reference to commits that moves as you commit; a tag is an immutable reference pointing to a specific commit, often used for releases.",
        "A branch is remote; a tag is only local.",
        "A branch has linear commits; a tag has branching commits.",
        "A branch requires approval; a tag does not."
      ],
      answerIndex: 0
    },
    {
      question: "What does git reset --hard do?",
      options: [
        "Resets the index and working tree, discarding all uncommitted changes and moving HEAD to the target commit.",
        "Resets the remote repository to match the local files.",
        "Deletes all local branches except master.",
        "Undoes commits but preserves current workspace changes."
      ],
      answerIndex: 0
    },
    {
      question: "What is git bisect used for?",
      options: [
        "Using binary search to find the specific commit that introduced a bug.",
        "Splitting a large repository into two submodules.",
        "Merging two distinct commit branches simultaneously.",
        "Comparing changes between two remote origins."
      ],
      answerIndex: 0
    },
    {
      question: "How do you squash commits?",
      options: [
        "By deleting intermediate commits manually.",
        "Using interactive rebase (git rebase -i) to combine multiple commits into a single commit.",
        "Using git commit --amend to delete history.",
        "Running git clean -fd on the branch."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between origin and upstream?",
      options: [
        "origin is the default name for your cloned repository fork; upstream refers to the original repository you cloned or forked from.",
        "origin is the original repository; upstream is the fork.",
        "origin refers to local branches; upstream refers to remote commits.",
        "They are interchangeable terms for remote origins."
      ],
      answerIndex: 0
    },
    {
      question: "What is a bare repository?",
      options: [
        "A repository created without a working directory, containing only Git administrative data, used primarily for sharing or hosting.",
        "A repository with no files added yet.",
        "A repository cloned without history.",
        "A remote repository with public access open."
      ],
      answerIndex: 0
    },
    {
      question: "How does git reflog help recover lost commits?",
      options: [
        "It records the history of references, listing every update to HEAD (commits, checkouts, resets), allowing you to find and restore deleted commits.",
        "It downloads backup files from the upstream origin.",
        "It generates clean logs for tracking file additions.",
        "It reports file system errors in git directories."
      ],
      answerIndex: 0
    }
  ],
  "Figma": [
    {
      question: "What is the difference between a frame and a group in Figma?",
      options: [
        "Groups support constraints and auto layout; frames do not.",
        "Frames act as parent containers with independent dimensions and clipping capabilities; groups wrap elements together and depend on their children's dimensions.",
        "Groups are for mobile layouts; frames are for desktop layouts.",
        "Frames can only hold text; groups can hold shapes and images."
      ],
      answerIndex: 1
    },
    {
      question: "What are components and how do variants work?",
      options: [
        "Components are reusable design elements; variants allow you to group similar components together and manage their states/options within a single container.",
        "Components are design code files; variants represent browser compatibility checks.",
        "Components must be created locally; variants are imported libraries.",
        "Components are styles; variants are interactive animations."
      ],
      answerIndex: 0
    },
    {
      question: "How does auto layout work in Figma?",
      options: [
        "It automatically imports UI designs from browser pages.",
        "It is a dynamic layout property that allows frames to grow or shrink, adjusting child elements automatically as content changes.",
        "It places frames on a standard grid structure automatically.",
        "It is a plugin that translates visual layers into CSS styles."
      ],
      answerIndex: 1
    },
    {
      question: "What is the difference between local and library styles?",
      options: [
        "Local styles are only available in the current file; library styles are published and can be shared and reused across multiple Figma files.",
        "Local styles are for draft projects; library styles are only for final exports.",
        "Local styles are color styles; library styles are typography styles.",
        "There is no difference; they sync automatically."
      ],
      answerIndex: 0
    },
    {
      question: "How do you create and use a design token in Figma?",
      options: [
        "Using Figma variables or styles to represent reusable design values (like colors, typography, or spacing) linked to components.",
        "Writing JSON code inside the Figma inspect panel.",
        "Using an external Figma compiler tool.",
        "Exporting Figma pages as raw Android XML."
      ],
      answerIndex: 0
    },
    {
      question: "What are constraints and how do they affect responsive design?",
      options: [
        "Rules that define how elements inside a frame behave when that frame is resized (e.g. pinned to left, right, top, or centered).",
        "Limitations on the size of files imported into Figma.",
        "Grid alignment settings that restrict manual layout adjustments.",
        "Code files that force layers to remain static."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between prototype and design mode?",
      options: [
        "Design mode is for building visual assets; prototype mode is for defining interactions, transitions, and connections between screens.",
        "Design mode is for vectors; prototype mode is for exporting images.",
        "Design mode is local; prototype mode is shared on servers.",
        "They are two separate applications by Figma."
      ],
      answerIndex: 0
    },
    {
      question: "How do you use Figma for handoff to developers?",
      options: [
        "Sharing the file access link and utilizing 'Dev Mode' to inspect properties, copy code snippets, and download assets.",
        "Compiling the Figma project into a production build zip.",
        "Exporting all screens as static PDF files.",
        "Developers cannot inspect Figma directly; they must use screenshots."
      ],
      answerIndex: 0
    },
    {
      question: "What is a master component vs an instance?",
      options: [
        "A master component is the original element that defines the properties; an instance is a linked copy that inherits changes from the master.",
        "A master component is read-only; an instance can be modified without limits.",
        "A master component is created by administrators; instances are user copies.",
        "They are identical elements with distinct names."
      ],
      answerIndex: 0
    },
    {
      question: "How do boolean operations (union, subtract, intersect) work?",
      options: [
        "They combine multiple shape layers into a single vector layer using mathematical Boolean logic.",
        "They evaluate code constraints in visual properties.",
        "They calculate sizing ratios between layout components.",
        "They validate color contrast values."
      ],
      answerIndex: 0
    },
    {
      question: "What is the purpose of the 'Inspect' panel?",
      options: [
        "To view code representations, dimensions, layout styles, and color values of selected elements to facilitate developer implementation.",
        "To check the file for design inconsistencies.",
        "To run spelling checks on text layers.",
        "To monitor application memory usage."
      ],
      answerIndex: 0
    },
    {
      question: "How do you set up a responsive grid in Figma?",
      options: [
        "Adding a Layout Grid property (columns, rows, or grid) to a frame, set to 'Stretch' with custom margins and gutters.",
        "Using auto layout to create vertical grids.",
        "Installing the Figma Grid Optimizer plugin.",
        "Responsive grids must be coded manually in developer mode."
      ],
      answerIndex: 0
    },
    {
      question: "What are interactive components in prototyping?",
      options: [
        "Components that can transition between variants (e.g. checkbox check/uncheck) automatically within a prototype, without changing screens.",
        "Buttons that open external URLs.",
        "Components with animated vector animations.",
        "Components that receive input values from users."
      ],
      answerIndex: 0
    },
    {
      question: "How do you manage multiple pages in a Figma project?",
      options: [
        "Using the Page section in the left layers panel to create distinct workspaces, organizing mockups, components, and archives.",
        "Creating separate Figma files for each screen.",
        "Adding frames vertically inside a single canvas.",
        "Using a Figma file manager dashboard extension."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between fill, stroke, and effect styles?",
      options: [
        "Fill defines background color/gradient; stroke defines border style; effect defines shadows, blurs, and overlays.",
        "Fill defines sizing; stroke defines padding; effect defines margins.",
        "They are interchangeable terms for color layers.",
        "Fill is for shapes; stroke is for text; effect is for images."
      ],
      answerIndex: 0
    }
  ],
  "Information Architecture": [
    {
      question: "What is Information Architecture (IA) and why does it matter?",
      options: [
        "The structural blueprint of a website or app, determining how content is organized, grouped, and navigated to ensure findability and usability.",
        "A design pattern used to write structured database scripts.",
        "The hardware layout of database nodes in a cluster.",
        "The graphic styling of menus and fonts."
      ],
      answerIndex: 0
    },
    {
      question: "What is a site map and what does it communicate?",
      options: [
        "A visual diagram showing the hierarchical structure and relationship of pages in a digital product.",
        "A geographical representation of database center locations.",
        "A list of external api endpoints called by the system.",
        "A layout grid configuration used in CSS files."
      ],
      answerIndex: 0
    },
    {
      question: "What is card sorting and when is it used?",
      options: [
        "A user research technique where participants organize topics into categories, used to design or evaluate information hierarchies.",
        "An algorithm that sorts cards based on alphabetical parameters.",
        "A debugging method that prints data components.",
        "A design workshop used to establish brand colors."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between tree testing and card sorting?",
      options: [
        "Card sorting builds an initial IA structure; tree testing validates the findability of items within a proposed hierarchical IA structure.",
        "Card sorting is quantitative; tree testing is qualitative.",
        "Card sorting is local; tree testing is done on servers.",
        "There is no difference; they are synonymous techniques."
      ],
      answerIndex: 0
    },
    {
      question: "What are the 8 principles of IA (by Morville & Rosenfeld)?",
      options: [
        "Principles guiding IA design: Objects, Choices, Disclosure, Exemplars, Front Doors, Multiple Classifications, Focused Navigation, Growth.",
        "A set of regulations defining database transactions.",
        "The layout grids recommended for mobile applications.",
        "Accessibility standards for visual contrast."
      ],
      answerIndex: 0
    },
    {
      question: "What is a taxonomy vs a folksonomy?",
      options: [
        "Taxonomy is a structured, top-down classification system designed by experts; folksonomy is a collaborative, bottom-up tagging system created by users.",
        "Taxonomy handles names; folksonomy handles values.",
        "They are two names for relational database structures.",
        "Taxonomy is for text files; folksonomy is for media archives."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between top-down and bottom-up IA?",
      options: [
        "Top-down IA starts with user goals and defines broad categories first; bottom-up IA starts with detailed content assets and groups them into logical structures.",
        "Top-down is faster; bottom-up is more secure.",
        "Top-down is for mobile layouts; bottom-up is for desktop pages.",
        "Top-down uses SQL; bottom-up uses MongoDB."
      ],
      answerIndex: 0
    },
    {
      question: "What is a content audit?",
      options: [
        "A systematic accounting and evaluation of all content assets on a website or application, documenting page info, status, and metrics.",
        "A review of code lines for licensing issues.",
        "A process of validating database schemas.",
        "An assessment of copyright violations."
      ],
      answerIndex: 0
    },
    {
      question: "What is wayfinding in the context of UX?",
      options: [
        "The system of visual cues and navigation aids that helps users understand where they are, where they have been, and where they can go next.",
        "An algorithm that calculates shortest paths in routing networks.",
        "A user testing method for physical layouts.",
        "A screen recording technique."
      ],
      answerIndex: 0
    },
    {
      question: "What is mental model and how does it affect navigation design?",
      options: [
        "A user's internal belief about how a system works; aligning navigation with this model ensures intuitive, predictable paths.",
        "A psychological classification of developer profiles.",
        "A data modeling methodology.",
        "A standard template for profile screens."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between hierarchical and faceted navigation?",
      options: [
        "Hierarchical navigation follows a strict nested structure; faceted navigation allows users to filter content by selecting multiple overlapping attributes.",
        "Hierarchical is vertical; faceted is horizontal.",
        "Hierarchical is for simple files; faceted is for media files.",
        "They are equivalent terms in navigation systems."
      ],
      answerIndex: 0
    },
    {
      question: "How does search affect IA decisions?",
      options: [
        "Search behavior logs reveal vocabulary preferences and common content destinations, helping refine categories and labels.",
        "Search fully replaces the need for structured navigation layouts.",
        "Search requires separate database servers for index patterns.",
        "Search does not interact with IA structure."
      ],
      answerIndex: 0
    },
    {
      question: "What is progressive disclosure?",
      options: [
        "An interaction design technique that helps reduce cognitive load by showing only essential information initially, revealing details as requested.",
        "An audit procedure that reports security violations.",
        "An incremental page loading method.",
        "A way to build forms using multiple pages."
      ],
      answerIndex: 0
    },
    {
      question: "What is the role of metadata in IA?",
      options: [
        "It provides structural tags and attributes that describe content assets, enabling search filtering, sorting, and dynamic content relationships.",
        "It stores database backup schedules.",
        "It defines page titles for SEO optimization.",
        "It measures page performance speeds."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between IA and UX design?",
      options: [
        "IA is a subset of UX focusing on information structure and organization; UX encompasses the complete user experience, including interaction and visual design.",
        "IA is for developers; UX is for designers.",
        "IA handles layout grids; UX handles typography.",
        "They are identical terms."
      ],
      answerIndex: 0
    }
  ],
  "Statistics": [
    {
      question: "What is the difference between population and sample?",
      options: [
        "Population is the entire group of interest; sample is a subset of that group selected to estimate characteristics of the population.",
        "Population is local; sample is remote.",
        "Population represents values; sample represents groups.",
        "They are synonyms in statistical research."
      ],
      answerIndex: 0
    },
    {
      question: "What is the Central Limit Theorem?",
      options: [
        "As sample size increases, the sampling distribution of the mean approaches a normal distribution, regardless of the population distribution shape.",
        "The mean of any population is always equal to its median.",
        "The standard deviation of a sample decreases exponentially.",
        "Statistical tests are valid only for sample sizes greater than 100."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between mean, median, and mode?",
      options: [
        "Mean is the mathematical average; median is the middle value when sorted; mode is the most frequently occurring value.",
        "Mean is middle; median is average; mode is total.",
        "Mean handles strings; median handles integers; mode handles objects.",
        "They are three names for the same value."
      ],
      answerIndex: 0
    },
    {
      question: "What is standard deviation and what does it tell you?",
      options: [
        "A measure of the amount of variation or dispersion of a set of values, indicating how much data points deviate from the mean.",
        "The average error in dataset metrics.",
        "The difference between the maximum and minimum values.",
        "The percentage of missing values in a population."
      ],
      answerIndex: 0
    },
    {
      question: "What is a p-value and what does it mean?",
      options: [
        "The probability of obtaining results as extreme as the observed results, assuming the null hypothesis is true; lower values suggest rejecting the null.",
        "The percentage of values matching standard models.",
        "The calculation rate of sample parameters.",
        "The correlation coefficient between variables."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between Type I and Type II errors?",
      options: [
        "Type I is a false positive (rejecting a true null hypothesis); Type II is a false negative (failing to reject a false null hypothesis).",
        "Type I is a false negative; Type II is a false positive.",
        "Type I is a value error; Type II is a sample size error.",
        "Type I is corrected by variables; Type II is corrected by logs."
      ],
      answerIndex: 0
    },
    {
      question: "What is a confidence interval?",
      options: [
        "A range of values, derived from sample statistics, that is likely to contain the true population parameter with a specified level of confidence.",
        "The probability that a hypothesis test is accurate.",
        "The correlation coefficient between datasets.",
        "The margin of error in census results."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between correlation and causation?",
      options: [
        "Correlation indicates a linear relationship between variables; causation implies that a change in one variable directly leads to a change in another.",
        "Correlation is mathematical; causation is graphical.",
        "Correlation is positive; causation is negative.",
        "They are equivalent terms in statistical models."
      ],
      answerIndex: 0
    },
    {
      question: "What is Bayes' theorem?",
      options: [
        "A mathematical formula for determining conditional probability: P(A|B) = [P(B|A) * P(A)] / P(B).",
        "An algorithm for calculating standard distributions.",
        "A hypothesis testing method for large populations.",
        "A logic rule for linear regressions."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between parametric and non-parametric tests?",
      options: [
        "Parametric tests assume specific underlying probability distributions (like normal); non-parametric tests do not make assumptions about distribution shape.",
        "Parametric tests are only for small samples; non-parametric are for large samples.",
        "Parametric tests are descriptive; non-parametric are inferential.",
        "They are two categories of qualitative analysis."
      ],
      answerIndex: 0
    },
    {
      question: "What is a normal distribution and why is it important?",
      options: [
        "A symmetric bell-shaped distribution where most observations cluster around the central peak, fundamental because many natural phenomena follow this pattern.",
        "A distribution where all values have equal probability.",
        "A skewed distribution used in financial modeling.",
        "A qualitative classification of data structures."
      ],
      answerIndex: 0
    },
    {
      question: "What is hypothesis testing?",
      options: [
        "A formal statistical method using sample data to evaluate the plausibility of a claim or hypothesis regarding a population parameter.",
        "A process of testing code exceptions under loads.",
        "A survey method for gathering database parameters.",
        "An audit procedure checking model accuracy."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between variance and covariance?",
      options: [
        "Variance measures the spread of a single variable; covariance measures how two variables change together.",
        "Variance is positive; covariance is negative.",
        "Variance is average; covariance is sum.",
        "They are interchangeable metrics."
      ],
      answerIndex: 0
    },
    {
      question: "What is A/B testing and how is it statistically validated?",
      options: [
        "A randomized experiment comparing two versions (A and B) using hypothesis testing (like t-tests or z-tests) to determine if a metric difference is statistically significant.",
        "A method of formatting UI elements.",
        "A code testing logic checking server requests.",
        "A user validation process checking signup rates."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between descriptive and inferential statistics?",
      options: [
        "Descriptive statistics summarize or describe features of a dataset; inferential statistics use sample data to make generalizations or predictions about a larger population.",
        "Descriptive handles graphs; inferential handles equations.",
        "Descriptive is qualitative; inferential is quantitative.",
        "They are interchangeable classifications."
      ],
      answerIndex: 0
    }
  ],
  "NLP": [
    {
      question: "What is tokenization?",
      options: [
        "The process of breaking a text stream into smaller, meaningful units like words, phrases, or symbols (tokens).",
        "A security practice that replaces API keys with tokens.",
        "A database normalization technique.",
        "A method of compiling programming statements."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between stemming and lemmatization?",
      options: [
        "Stemming chops off word endings heuristically; lemmatization uses vocabulary and morphological analysis to return dictionary base forms (lemmas).",
        "Stemming is context-aware; lemmatization is rule-based.",
        "Stemming is for deep learning; lemmatization is for regex search.",
        "They are two terms for POS tagging."
      ],
      answerIndex: 0
    },
    {
      question: "What is a bag-of-words model?",
      options: [
        "A simplifying representation of text where grammar and word order are disregarded, keeping only word frequency count.",
        "A dataset repository storing text files.",
        "A text formatting component in text editors.",
        "An algorithm that checks spelling errors."
      ],
      answerIndex: 0
    },
    {
      question: "What is TF-IDF and how is it calculated?",
      options: [
        "Term Frequency-Inverse Document Frequency, measuring word importance by multiplying term frequency by log of inverse document frequency.",
        "Text Formatting-Integrated Data Flow, calculated using string indexes.",
        "Transformer-based Feature Identification, calculated in neural networks.",
        "A categorization metric for string structures."
      ],
      answerIndex: 0
    },
    {
      question: "What is word embedding? How does Word2Vec work?",
      options: [
        "A vector representation of words mapping semantic meanings into continuous vector spaces; Word2Vec uses shallow neural networks (CBOW or Skip-gram) to learn these vectors from context.",
        "A text formatting standard used in databases.",
        "A method of compressing string arrays on disk.",
        "A process of linking related HTML elements."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between NER and POS tagging?",
      options: [
        "NER identifies named entities (names, dates, locations); POS tagging labels the grammatical part of speech (nouns, verbs, adjectives) of each word.",
        "NER is local; POS is remote.",
        "NER is used only for English; POS is for all languages.",
        "They are synonyms."
      ],
      answerIndex: 0
    },
    {
      question: "What is a language model?",
      options: [
        "A probabilistic model that estimates the likelihood of a sequence of words occurring in a language.",
        "A translation dictionary file format.",
        "A compiler template for syntax trees.",
        "A data modeling tool for text databases."
      ],
      answerIndex: 0
    },
    {
      question: "What is the transformer architecture?",
      options: [
        "A deep learning architecture based on self-attention mechanisms, avoiding recurrent networks, permitting parallel training and long-range dependencies.",
        "A system configuration mapping database queries.",
        "A text translation program built on templates.",
        "A styling compiler framework."
      ],
      answerIndex: 0
    },
    {
      question: "What is attention mechanism in NLP?",
      options: [
        "A component allowing models to focus dynamically on specific parts of an input sequence when generating output, regardless of distance.",
        "A notification algorithm alerting users of typos.",
        "A process prioritizing main execution threads.",
        "A styling attribute highlighted on visual screens."
      ],
      answerIndex: 0
    },
    {
      question: "What is BERT and how does it differ from GPT?",
      options: [
        "BERT is bidirectional (processes context left-to-right and right-to-left, autoencoding); GPT is autoregressive (left-to-right decoder, predictive).",
        "BERT is for translation; GPT is for classification.",
        "BERT is local; GPT is cloud-based.",
        "They are two generations of the same model."
      ],
      answerIndex: 0
    },
    {
      question: "What is text classification and what algorithms are commonly used?",
      options: [
        "Assigning categories to text; algorithms include Naive Bayes, Support Vector Machines, Logistic Regression, and BERT.",
        "Sorting paragraphs alphabetically. Uses QuickSort.",
        "Hashing text inputs to prevent duplication.",
        "Validating syntax templates."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between sentiment analysis and emotion detection?",
      options: [
        "Sentiment analysis classifies text polarity (positive, negative, neutral); emotion detection identifies specific emotional states (anger, joy, sadness).",
        "They are synonyms.",
        "Sentiment is qualitative; emotion is quantitative.",
        "Sentiment is for feedback; emotion is for reviews."
      ],
      answerIndex: 0
    },
    {
      question: "What is sequence-to-sequence modeling?",
      options: [
        "A model architecture transforming an input sequence to an output sequence (e.g. machine translation, summarization), using encoder-decoder networks.",
        "A sorting pipeline in relational queries.",
        "A process of backing up files sequentially.",
        "A type of regex string validation."
      ],
      answerIndex: 0
    },
    {
      question: "What is perplexity as an NLP metric?",
      options: [
        "A measurement of how well a probability distribution or probability model predicts a sample, representing the branching factor of the language.",
        "A score measuring vocabulary difficulty.",
        "The count of unknown words in a corpus.",
        "A training error coefficient."
      ],
      answerIndex: 0
    },
    {
      question: "What are the challenges of multilingual NLP?",
      options: [
        "Data scarcity in low-resource languages, morphological variations, cross-lingual alignment, script differences, and syntax structure discrepancies.",
        "Lack of translation programs.",
        "File compression issues in non-ASCII character systems.",
        "Database constraints regarding character collations."
      ],
      answerIndex: 0
    }
  ],
  "Android Development": [
    {
      question: "What is the difference between an Activity and a Fragment?",
      options: [
        "An Activity is a single focused entry point that provides a user interface screen; a Fragment represents a reusable portion of user interface within an Activity.",
        "Activities are for mobile layouts; Fragments are for tablet layouts.",
        "Activities are written in Kotlin; Fragments must be in Java.",
        "They are two names for the same UI layout class."
      ],
      answerIndex: 0
    },
    {
      question: "What is the Android Activity lifecycle?",
      options: [
        "The sequence of callback states (onCreate, onStart, onResume, onPause, onStop, onDestroy) an Activity transitions through as it is initialized, running, or destroyed.",
        "The compile cycle of an Android APK file.",
        "The database connections process in Room queries.",
        "The runtime check for memory leak allocations."
      ],
      answerIndex: 0
    },
    {
      question: "What is ViewModel and why is it used?",
      options: [
        "A class designed to store and manage UI-related data in a lifecycle-aware way, allowing data to survive configuration changes like screen rotations.",
        "A layout layout file defined in XML patterns.",
        "A database caching layer built in memory.",
        "An interface routing intents between separate apps."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between SharedPreferences and a database?",
      options: [
        "SharedPreferences stores simple key-value pairs in XML files; databases (like SQLite/Room) are designed for structured, complex relational datasets.",
        "SharedPreferences is asynchronous; databases are synchronous.",
        "SharedPreferences requires root access; databases do not.",
        "They are identical under the hood."
      ],
      answerIndex: 0
    },
    {
      question: "What is RecyclerView and how is it different from ListView?",
      options: [
        "RecyclerView recycles child views to save memory and CPU cycles when displaying large datasets, offering flexible layout managers; ListView creates views for all elements or lacks advanced recycling.",
        "RecyclerView is only for grids; ListView is only for lines.",
        "RecyclerView is a third-party plugin; ListView is built-in.",
        "They are interchangeable components."
      ],
      answerIndex: 0
    },
    {
      question: "What is an Intent and what are its types?",
      options: [
        "An messaging object used to request an action from another app component; types are Explicit Intents (specifies target) and Implicit Intents (specifies action).",
        "A type of data class; types are Local and Global.",
        "A database query type; types are Fetch and Update.",
        "An APK file package compiler parameter."
      ],
      answerIndex: 0
    },
    {
      question: "What is Jetpack Compose?",
      options: [
        "Android's modern declarative UI toolkit used to build native user interfaces using Kotlin functions rather than XML layouts.",
        "A background task executor.",
        "A security library validating API tokens.",
        "A dependency injection system built on Gradle."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between Service and IntentService?",
      options: [
        "A Service runs on the main thread by default; IntentService creates a background worker thread to process intents sequentially and stops itself when done.",
        "Service is local; IntentService is remote.",
        "Service runs forever; IntentService has a 1-minute timeout.",
        "They behave identically in modern Android versions."
      ],
      answerIndex: 0
    },
    {
      question: "How does LiveData work?",
      options: [
        "An observable data holder class that is lifecycle-aware, notifying active observers (like Activities or Fragments) only when their lifecycle states are active.",
        "A streaming library connecting SQLite databases.",
        "An adapter class loading layouts into RecyclerViews.",
        "A class executing tasks asynchronously in background threads."
      ],
      answerIndex: 0
    },
    {
      question: "What is dependency injection and how is Hilt used in Android?",
      options: [
        "A technique for achieving Inversion of Control between classes; Hilt is a library built on top of Dagger to simplify dependency injection in Android applications.",
        "A method of injecting databases. Hilt is the connection pool.",
        "A build configuration. Hilt compiles target files.",
        "A styling design framework for theme setup."
      ],
      answerIndex: 0
    },
    {
      question: "What is a ContentProvider?",
      options: [
        "An Android component that manages access to a structured set of data, enabling secure sharing of data between different applications.",
        "A system UI layout that displays media files.",
        "A background loader fetching assets from APIs.",
        "A security provider encrypting credential inputs."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between Serializable and Parcelable?",
      options: [
        "Serializable is a standard Java interface using reflection (slower); Parcelable is an Android-specific interface using custom serialization code (much faster).",
        "Serializable is async; Parcelable is sync.",
        "Serializable is for storage; Parcelable is for memory.",
        "There is no difference in Android apps."
      ],
      answerIndex: 0
    },
    {
      question: "What is WorkManager used for?",
      options: [
        "Scheduling deferrable, guaranteed background work that needs to run even if the app exits or the device restarts.",
        "Managing thread allocations in CPU tasks.",
        "Tracking user interactions in layout views.",
        "Syncing Gradle versions with Kotlin SDKs."
      ],
      answerIndex: 0
    },
    {
      question: "How does the back stack work in Android navigation?",
      options: [
        "It stores visited screens (activities or fragments) in a last-in, first-out stack, letting the system return users to previous screens when they press back.",
        "It manages background threads in a queue.",
        "It schedules database queries in an execution pile.",
        "It monitors system errors during compiles."
      ],
      answerIndex: 0
    },
    {
      question: "What is ProGuard/R8 and why is it important?",
      options: [
        "A code optimization tool that shrinks, obfuscates, and optimizes app code, reducing APK size and making the code harder to reverse engineer.",
        "A database tool checking query speeds.",
        "An emulator validation suite.",
        "A compiler module translating XML to layouts."
      ],
      answerIndex: 0
    }
  ],
  "Flutter": [
    {
      question: "What is the difference between a StatelessWidget and a StatefulWidget?",
      options: [
        "StatelessWidget is immutable (its configuration cannot change over time); StatefulWidget maintains mutable state that can change and trigger rebuilds.",
        "StatelessWidget cannot contain text; StatefulWidget can.",
        "StatelessWidget runs on main thread; StatefulWidget runs in Isolates.",
        "StatelessWidget is compiled; StatefulWidget is compiled dynamically."
      ],
      answerIndex: 0
    },
    {
      question: "What is the widget tree in Flutter?",
      options: [
        "The hierarchical layout structure composed of widgets representing user interface elements, layouts, and configurations in a Flutter application.",
        "The folder hierarchy of the Flutter project.",
        "The inheritance structure of the Dart compiler.",
        "The repository configuration of packages."
      ],
      answerIndex: 0
    },
    {
      question: "What is setState() and when should you use it?",
      options: [
        "A method that triggers a rebuild of a StatefulWidget's UI after updating its internal state variables.",
        "A method initializing state variables in constructors.",
        "A function calling database connections.",
        "A static routing method."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between hot reload and hot restart?",
      options: [
        "Hot reload injects code changes into the running Dart VM directly, preserving state; Hot restart destroys current state and rebuilds the widget tree from scratch.",
        "Hot reload re-compiles the app; Hot restart loads web cache.",
        "Hot reload is local; Hot restart runs on remote servers.",
        "They behave identically in Flutter."
      ],
      answerIndex: 0
    },
    {
      question: "What is BuildContext?",
      options: [
        "A handle to the location of a widget in the widget tree, used to look up themes, media queries, or navigation routes.",
        "A class that compiles the application into APK formats.",
        "A configuration file specifying package dependencies.",
        "A context object managing database transactions."
      ],
      answerIndex: 0
    },
    {
      question: "What is the purpose of the pubspec.yaml file?",
      options: [
        "To declare package dependencies, assets, fonts, and metadata for the Flutter application.",
        "To write theme configurations in CSS styles.",
        "To define route configurations for screens.",
        "To store local user credentials."
      ],
      answerIndex: 0
    },
    {
      question: "What is InheritedWidget?",
      options: [
        "A base class for widgets that efficiently propagates information down the widget tree to descendant widgets that depend on it.",
        "A design pattern used for class inheritance.",
        "A widget inheriting visual properties from parent layouts.",
        "A module importing package files dynamically."
      ],
      answerIndex: 0
    },
    {
      question: "How does Flutter handle state management (Provider, Riverpod, Bloc)?",
      options: [
        "By using design patterns and libraries that separate business logic from UI, notifying widgets to rebuild when shared state changes.",
        "By saving UI values to browser local storage automatically.",
        "By recreating the entire application instance dynamically.",
        "State management is handled automatically by the Dart VM without libraries."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between Column and ListView?",
      options: [
        "Column expects finite children and does not scroll when overflowing; ListView scrolls automatically and lazily builds visible children.",
        "Column is horizontal; ListView is vertical.",
        "Column is for images; ListView is for text.",
        "Column only works inside Row layouts."
      ],
      answerIndex: 0
    },
    {
      question: "What are Keys in Flutter and when are they needed?",
      options: [
        "Identifiers for Widgets, Elements, and Semantics, needed when modifying a collection of stateful widgets (like reordering lists).",
        "Encrypted validation tokens used in API requests.",
        "Keyboard shortcut definitions mapping keys to actions.",
        "Database keys linking relational tables."
      ],
      answerIndex: 0
    },
    {
      question: "What is FutureBuilder and how is it used?",
      options: [
        "A widget that builds itself based on the latest snapshot of interaction with a Future, displaying loaders, error messages, or final data.",
        "A background task executor compiling scripts.",
        "A compiler flag optimizing Future loops.",
        "A routing adapter connecting remote links."
      ],
      answerIndex: 0
    },
    {
      question: "What is the difference between Expanded and Flexible?",
      options: [
        "Expanded forces a child of a Row or Column to fill the remaining space; Flexible allows a child to fill remaining space but doesn't force it.",
        "Expanded is vertical; Flexible is horizontal.",
        "Expanded is only for Rows; Flexible is only for Columns.",
        "They are exact aliases."
      ],
      answerIndex: 0
    },
    {
      question: "How do you handle navigation and routing in Flutter?",
      options: [
        "Using the Navigator API (Navigator.push/pop) or declarative routing packages (like go_router) to manage the history stack of routes.",
        "Writing HTML anchor links matching screen URLs.",
        "Importing separate activities from native platforms.",
        "Using isolated background intents."
      ],
      answerIndex: 0
    },
    {
      question: "What is isolate in Flutter/Dart?",
      options: [
        "A thread of execution that does not share memory with other isolates, communicating only through message passing, used for heavy compute tasks.",
        "A security restriction blocking external internet calls.",
        "A styling configuration separating widgets.",
        "A test workspace isolating unit tests."
      ],
      answerIndex: 0
    },
    {
      question: "What is tree shaking in Flutter and why does it matter?",
      options: [
        "An optimization phase during compilation that removes unused code and resources, reducing the final build size of the application.",
        "A database transaction cleanup process.",
        "A UI rendering technique reordering components.",
        "A debugging script tracking widget leaks."
      ],
      answerIndex: 0
    }
  ]
};
