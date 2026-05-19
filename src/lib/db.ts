import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Book from '@/models/Book';
import Category from '@/models/Category';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cached connection for serverless environment
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (MONGODB_URI) {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongooseInstance) => {
        console.log('MongoDB Atlas cloud database connected successfully via Mongoose.');
        
        // Auto-seed empty cloud database with premium LCU academic data
        try {
          const categoryCount = await Category.countDocuments();
          if (categoryCount === 0) {
            console.log('Fresh MongoDB instance detected. Seeding LCU bookstore assets...');
            
            // 1. Seed categories
            const seededCategories = [];
            for (const cat of INITIAL_CATEGORIES) {
              const newCat = await Category.create({
                name: cat.name
              });
              seededCategories.push(newCat);
            }
            
            // 2. Seed books mapping to the newly created Category ObjectIds
            for (const book of INITIAL_BOOKS) {
              const matchedCat = seededCategories.find(c => c.name === book.category_name);
              if (matchedCat) {
                await Book.create({
                  title: book.title,
                  author: book.author,
                  category_id: matchedCat._id,
                  category_name: matchedCat.name,
                  description: book.description,
                  cover_image: book.cover_image,
                  availability: book.availability
                });
              }
            }
            console.log('Auto-seeding of LCU database completed successfully!');
          }
        } catch (seedError) {
          console.error('Error during auto-seeding LCU cloud database:', seedError);
        }

        return mongooseInstance;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  } else {
    // Return null to signify mock mode is active
    return null;
  }
}

// Robust File-based Mock Database for server-side fallback
const MOCK_DB_PATH = path.join(process.cwd(), 'src', 'lib', 'mockdb.json');

const INITIAL_BOOKS = [
  // --- SOFTWARE ENGINEERING ---
  {
    _id: 'm1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
    content: `Chapter 1: Clean Code

You are reading this book for two reasons. First, you are a programmer. Second, you want to be a better programmer. Good. We need better programmers.

This is a book about good programming. It is filled with code. We are going to look at code from every different direction. We’ll look down at it from the top, up at it from the bottom, and through it from the inside out. By the time we are done, we’re going to know a lot about code. What’s more, we’ll be able to tell the difference between good code and bad code.

What Is Clean Code?
There are probably as many definitions as there are programmers. So I asked some of the very well-known and deeply experienced programmers what they thought.

Bjarne Stroustrup, inventor of C++:
"I like my code to be elegant and efficient. The logic should be straightforward to make it hard for bugs to hide, the dependencies minimal to ease maintenance, error handling complete according to an articulated strategy, and performance close to optimal so as not to tempt people to make the code messy with unprincipled optimizations. Clean code does one thing well."

Grady Booch, author of Object Oriented Analysis and Design with Applications:
"Clean code is simple and direct. Clean code reads like well-written prose. Clean code never obscures the designer’s intent but rather is full of crisp abstractions and straightforward lines of control."

The Boy Scout Rule:
It’s not enough to write the code well. The code has to be kept clean over time. We’ve all seen code rot and degrade as time passes. So we must take an active role in preventing this degradation. The Boy Scouts of America have a simple rule that we can apply to our profession:
"Leave the campground cleaner than you found it."`
  },
  {
    _id: 'm2',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=600',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
    content: `Chapter 1: Introduction

Designing object-oriented software is hard, and designing reusable object-oriented software is even harder. You must find pertinent objects, factor them into classes at the right granularity, define class interfaces and inheritance hierarchies, and establish key relationships among them. Your design should be specific to the problem at hand but also general enough to address future problems and requirements.

What Is a Design Pattern?
Christopher Alexander says, "Each pattern describes a problem which occurs over and over again in our environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over, without ever doing it the same way twice." Even though Alexander was talking about buildings and towns, what he says is true about object-oriented design patterns. 

Our solutions are expressed in terms of objects and interfaces instead of walls and doors, but at the core of both kinds of patterns is a solution to a problem in a context.

In general, a pattern has four essential elements:
1. The pattern name is a handle we can use to describe a design problem, its solutions, and consequences in a word or two.
2. The problem describes when to apply the pattern. It explains the problem and its context.
3. The solution describes the elements that make up the design, their relationships, responsibilities, and collaborations.
4. The consequences are the results and trade-offs of applying the pattern.

The Catalog of Design Patterns:
- Abstract Factory
- Builder
- Factory Method
- Prototype
- Singleton
- Adapter
- Bridge
- Composite
- Decorator`
  },
  {
    _id: 'm3',
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'Andrew Hunt',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--what do you do to make software that is robust, clean, and institutionally maintainable.',
    content: `Chapter 1: A Pragmatic Philosophy

What makes a Pragmatic Programmer? We feel it’s an attitude, a style, a philosophy of approaching problems and their solutions. They think beyond the immediate problem, always trying to place it in its larger context, always trying to be aware of the bigger picture. After all, without this larger context, how can you be pragmatic? How can you make intelligent compromises and informed decisions?

The Cat Ate My Source Code
One of the cornerstones of the pragmatic philosophy is taking responsibility for yourself and your actions in terms of your career advancement, your learning, and your daily work. 

Take Responsibility
Responsibility is something you actively agree to. You make a commitment to ensure that something is done right, but you don't necessarily have direct control over every aspect of it. In addition to doing your own personal best, you must analyze the situation for risks that are beyond your control.

Provide Options, Don't Make Lame Excuses
Before you approach anyone to tell them why something can't be done, is late, or is broken, stop and listen to yourself. Talk to the rubber duck on your monitor, or the cat. Does your excuse sound reasonable, or stupid? 

Software Entropy
While software development is immune from almost all physical laws, entropy hits us hard. Entropy is a term from physics that refers to the amount of "disorder" in a system. When disorder increases in software, programmers call it "software rot."

Don't Live with Broken Windows
Don't leave "broken windows" (bad designs, wrong decisions, or poor code) unrepaired. Fix each one as soon as it is discovered. If there is insufficient time to fix it properly, then board it up. Perhaps you can comment out the offending code, or display a "Not Implemented" message, or substitute dummy data instead.`
  },

  // --- COMPUTER SCIENCE ---
  {
    _id: 'm4',
    title: 'Introduction to Algorithms (Fourth Edition)',
    author: 'Thomas H. Cormen',
    category_id: 'c2',
    category_name: 'Computer Science',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600',
    description: 'This book provides a comprehensive and rigorous introduction to the modern study of computer algorithms.',
    content: `Chapter 1: The Role of Algorithms in Computing

What are algorithms? Why is the study of algorithms worthwhile? What is the role of algorithms relative to other technologies used in computers? In this chapter, we will answer these questions.

1.1 Algorithms
Informally, an algorithm is any well-defined computational procedure that takes some value, or set of values, as input and produces some value, or set of values, as output. An algorithm is thus a sequence of computational steps that transform the input into the output.

We can also view an algorithm as a tool for solving a well-specified computational problem. The statement of the problem specifies in general terms the desired input/output relationship. The algorithm describes a specific computational procedure for achieving that input/output relationship.

For example, we might need to sort a sequence of numbers into nondecreasing order. This problem arises frequently in practice and provides fertile ground for introducing many standard design techniques and analysis tools. Here is how we formally define the sorting problem:

Input: A sequence of n numbers (a1, a2, ..., an).
Output: A permutation (reordering) (a'1, a'2, ..., a'n) of the input sequence such that a'1 <= a'2 <= ... <= a'n.

1.2 Algorithms as a technology
If computers were infinitely fast and computer memory were free, would you have any reason to study algorithms? The answer is yes, if for no other reason than that you would still like to demonstrate that your solution method terminates and does so with the correct answer.`
  },
  {
    _id: 'm5',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    category_id: 'c2',
    category_name: 'Computer Science',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    description: 'The long-anticipated revision of this industry-standard text offers the most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence.',
    content: `Chapter 1: Introduction

In which we try to explain why we consider artificial intelligence to be a subject most worthy of study, and in which we try to decide what exactly it is, this being a good thing to decide before embarking.

1.1 What Is AI?
We call ourselves Homo sapiens—man the wise—because our intelligence is so important to us. For thousands of years, we have tried to understand how we think; that is, how a mere handful of matter can perceive, understand, predict, and manipulate a world far larger and more complicated than itself. The field of artificial intelligence, or AI, goes further still: it attempts not just to understand but also to build intelligent entities.

AI is one of the newest fields in science and engineering. Work started in earnest soon after World War II, and the name itself was coined in 1956. Along with molecular biology, AI is regularly cited as the "field I would most like to be in" by scientists in other disciplines. A student in physics might reasonably feel that all the good ideas have already been taken by Galileo, Newton, Einstein, and the rest. AI, on the other hand, still has openings for several full-time Einsteins and Edisons.

Approaches to AI:
Historically, researchers have pursued several different goals under the umbrella of AI. Some have focused on trying to simulate human thought processes, while others have focused on building rational systems that do the "right thing" regardless of how humans might do it.`
  },
  {
    _id: 'm6',
    title: 'Computer Networking: A Top-Down Approach',
    author: 'James F. Kurose',
    category_id: 'c2',
    category_name: 'Computer Science',
    availability: false,
    cover_image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    description: 'Building on the successful top-down approach of previous editions, this textbook focuses on internet protocols and software-defined networks.',
    content: `Chapter 1: Computer Networks and the Internet

1.1 What Is the Internet?
In this book, we will use the public Internet, a specific computer network, as our principal vehicle for discussing computer networks and their protocols. But what is the Internet? There are a couple of ways to answer this question. First, we can describe the nuts and bolts of the Internet, that is, the basic hardware and software components that make up the Internet. Second, we can describe the Internet in terms of a networking infrastructure that provides services to distributed applications.

A Nuts-and-Bolts Description
The Internet is a computer network that interconnects billions of computing devices throughout the world. Not too long ago, these computing devices were primarily traditional desktop PCs, Linux workstations, and so-called servers that store and transmit information such as Web pages and e-mail messages. Increasingly, however, non-traditional devices such as smartphones, tablets, TVs, gaming consoles, thermostats, home security systems, home appliances, watches, glasses, cars, and even picture frames are being connected to the Internet.

All of these devices are called hosts or end systems. End systems are connected together by a network of communication links and packet switches.

Protocols
End systems, packet switches, and other pieces of the Internet run protocols that control the sending and receiving of information within the Internet. TCP (Transmission Control Protocol) and IP (Internet Protocol) are two of the most important protocols in the Internet.`
  },

  // --- LAW & JURISPRUDENCE ---
  {
    _id: 'm7',
    title: 'The Nigerian Legal System (Second Edition)',
    author: 'Obilade A. O.',
    category_id: 'c3',
    category_name: 'Law & Jurisprudence',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    description: 'An essential textbook providing a comprehensive analysis of the historical background, sources of law, and judicial system structure.',
    content: `Chapter 1: Introduction to the Nigerian Legal System

The study of the Nigerian legal system is an examination of the framework within which law operates in Nigeria. It involves a study of the sources of Nigerian law, the judicial system, and the various personnel involved in the administration of justice.

1.1 Historical Background
The history of the Nigerian legal system is inextricably tied to the political history of Nigeria. Before the advent of British rule, the various communities that make up modern Nigeria had their own systems of customary law. In the Islamic areas of the north, Islamic law (Sharia) was firmly established. The British introduction of English law did not entirely displace these pre-existing systems; rather, it created a dual (and sometimes tripartite) system of law.

1.2 The Concept of Law
What is law? This question has occupied the minds of jurists for centuries. In the context of the Nigerian legal system, law may be viewed as a body of rules regulating human conduct, recognized as binding by the state and enforced by state sanctions.

1.3 Sources of Nigerian Law
The sources of Nigerian law may be classified into primary and secondary sources. Primary sources include:
- The Constitution
- Legislation (Acts, Laws, Decrees, Edicts)
- Received English Law (Common Law, Doctrines of Equity, Statutes of General Application)
- Customary Law (including Islamic Law)
- Judicial Precedents (Case Law)

Secondary sources, on the other hand, include textbooks, law journals, and legal dictionaries. While not binding on the courts, they are often persuasive and relied upon when primary sources are silent or ambiguous.`
  },
  {
    _id: 'm8',
    title: 'Constitutional Law of Nigeria',
    author: 'Professor B. O. Nwabueze',
    category_id: 'c3',
    category_name: 'Law & Jurisprudence',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1589391886645-1514df239327?auto=format&fit=crop&q=80&w=600',
    description: 'A masterpiece study on the constitutional structure, human rights provisions, separation of powers, and regulatory frameworks governing federalism in the Federal Republic of Nigeria.',
    content: `Chapter 1: The Nature of the Constitution

1.1 What is a Constitution?
A constitution is the fundamental and organic law of a nation or state that establishes the institutions and apparatus of government, defines the scope of governmental sovereign powers, and guarantees individual civil rights and civil liberties. In Nigeria, the Constitution is the supreme law of the land, and any other law that is inconsistent with its provisions is null and void to the extent of its inconsistency.

1.2 Supremacy of the Constitution
Section 1(1) of the 1999 Constitution of the Federal Republic of Nigeria (as amended) declares unequivocally that: "This Constitution is supreme and its provisions shall have binding force on the authorities and persons throughout the Federal Republic of Nigeria." This principle of constitutional supremacy is the bedrock of constitutionalism in Nigeria. It means that the legislature, the executive, and the judiciary derive their powers from the Constitution and must act within its limits.

1.3 Separation of Powers
The Nigerian Constitution operates on the doctrine of separation of powers, a concept popularized by Montesquieu. The Constitution vests legislative powers in the National Assembly (Section 4), executive powers in the President (Section 5), and judicial powers in the Courts (Section 6). This separation is designed to prevent the concentration of power in a single body or individual, thereby checking tyranny and protecting liberty.

1.4 Federalism in Nigeria
Nigeria operates a federal system of government. Federalism refers to the division of governmental powers between a central (federal) government and regional (state) governments. The Constitution delineates these powers through the Exclusive Legislative List (reserved for the federal government) and the Concurrent Legislative List (where both federal and state governments can legislate, subject to the doctrine of covering the field).`
  },

  // --- ACCOUNTING & FINANCE ---
  {
    _id: 'm9',
    title: 'Financial Accounting & Reporting Standards',
    author: 'Jerry J. Weygandt',
    category_id: 'c4',
    category_name: 'Accounting & Finance',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    description: 'This textbook guides university scholars through foundational financial accounting principles, ledger structures, balancing techniques, and international financial reporting standards (IFRS) compliance.',
    content: `Chapter 1: Accounting in Action

What is Accounting?
You might be surprised to learn that accounting is a major component of nearly everything you do. If you have ever balanced a checkbook, calculated your GPA, or managed a budget for a student organization, you were using accounting principles. Accounting is the information system that identifies, records, and communicates the economic events of an organization to interested users.

1.1 The Activities of Accounting
To understand accounting better, let's break down the three main activities:
1. Identification: A company selects the economic events (transactions) relevant to its business.
2. Recording: Once identified, the company records these events to provide a history of its financial activities. Recording consists of keeping a systematic, chronological diary of events, measured in dollars and cents.
3. Communication: Finally, the company communicates the collected information to interested users by means of accounting reports. The most common of these reports are financial statements.

1.2 Users of Accounting Data
Who uses accounting data? The users fall into two broad groups: internal users and external users.
Internal users are managers who plan, organize, and run a business. These include marketing managers, production supervisors, finance directors, and company officers.
External users include investors (owners) who use accounting information to make decisions to buy, hold, or sell stock. Creditors (such as suppliers and bankers) use accounting information to evaluate the risks of selling on credit or lending money.

1.3 The Building Blocks of Accounting
Ethics in Financial Reporting: The standards of conduct by which one's actions are judged as right or wrong, honest or dishonest, fair or not fair, are ethics. Effective financial reporting depends on sound ethical behavior.
Generally Accepted Accounting Principles (GAAP): These are recognized rules and practices that define acceptable accounting processes. In many international contexts, the International Financial Reporting Standards (IFRS) are heavily utilized.`
  },
  {
    _id: 'm10',
    title: 'Principles of Auditing and Assurance Services',
    author: 'William F. Messier',
    category_id: 'c4',
    category_name: 'Accounting & Finance',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    description: 'A comprehensive study of auditor responsibilities, corporate control checking protocols, fraud detection, and regulatory audits under modern global financial regulations.',
    content: `Chapter 1: The Demand for Audit and Other Assurance Services

The Role of Auditing in Society
Auditing plays a vital economic role in society. To understand this role, one must understand the relationship between principals (owners or shareholders) and agents (managers). In a modern corporate structure, the individuals who manage the business are often not the same individuals who own it. This separation of ownership and control leads to a potential conflict of interest known as the agency problem.

The Agency Problem
Managers (agents) have an informational advantage over owners (principals). Managers know the true financial position and results of operations of the entity, while absentee owners do not. Because managers' compensation is often tied to reported financial results, they have an incentive to manipulate the financial statements to present a more favorable picture. Owners recognize this incentive and are therefore skeptical of the financial reports provided by management.

The Solution: The Independent Auditor
To mitigate the agency problem and reduce information asymmetry, principals engage an independent auditor. The auditor's job is to examine management's financial reports and gather evidence to determine whether the reports fairly present the financial position of the entity. By issuing an independent audit report, the auditor adds credibility to the financial statements, reducing the risk that the information is materially misstated.

Auditing, Attestation, and Assurance Services
While often used interchangeably, these three terms represent different levels of service.
- Auditing: A systematic process of objectively obtaining and evaluating evidence regarding assertions about economic actions and events.
- Attestation Services: Services in which a practitioner is engaged to issue a report on subject matter, or an assertion about subject matter, that is the responsibility of another party.
- Assurance Services: Independent professional services that improve the quality of information, or its context, for decision makers.`
  },

  // --- MASS COMMUNICATION ---
  {
    _id: 'm11',
    title: 'Introduction to Mass Communication: Media Literacy',
    author: 'Stanley J. Baran',
    category_id: 'c5',
    category_name: 'Mass Communication',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=600',
    description: 'Encouraging university scholars to keep their media literacy sharp, this textbook explores the historical evolution and modern digital formats of journalism.',
    content: `Chapter 1: Mass Communication, Culture, and Media Literacy

1.1 What is Mass Communication?
Communication is a complex process. It is the transmission of a message from a source to a receiver. But this definition is somewhat inadequate. A more sophisticated definition is that communication is the process of creating shared meaning. When we talk about mass communication, we are referring to the process of creating shared meaning between the mass media and their audiences.

The process of mass communication is unique because it involves a large, heterogeneous, and often geographically dispersed audience. The sender in mass communication is typically a complex organization (like a television network or a newspaper publisher) using technological devices to transmit the message.

1.2 Culture and Communication
Culture is the learned behavior of members of a given social group. It is the lens through which we make the world meaningful. Communication and culture are inextricably linked. We use communication to learn, maintain, and transmit culture. At the same time, our culture dictates the rules of communication. 

The mass media are our culture's primary storytellers. As such, they play a profound role in shaping our understanding of the world, our values, and our beliefs. 

1.3 Media Literacy
Because the mass media have such a significant impact on our culture, it is essential that we become media literate. Media literacy is the ability to effectively and efficiently comprehend and use any form of mediated communication.

Key elements of media literacy include:
1. An awareness of the impact of media.
2. An understanding of the process of mass communication.
3. Strategies for analyzing and discussing media messages.
4. An understanding of media content as a text that provides insight into our culture and our lives.
5. The ability to enjoy, understand, and appreciate media content.`
  },
  {
    _id: 'm12',
    title: 'Broadcast Journalism: Techniques of Radio and TV News',
    author: 'Peter Stewart & Ray Alexander',
    category_id: 'c5',
    category_name: 'Mass Communication',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600',
    description: 'An industry-grade practical guide to modern broadcast news editing, scriptwriting, voice presentation, interview methods, and digital editing tools used in university newsrooms.',
    content: `Chapter 1: The Newsroom

Welcome to the chaotic, deadline-driven, and exciting world of broadcast journalism. The newsroom is the beating heart of any broadcasting station. It is here that stories are conceived, researched, written, edited, and ultimately presented to the audience.

1.1 What Makes News?
Before you can report the news, you must first understand what news is. Generally, news is defined by several key news values:
- Timeliness: Is it happening right now?
- Proximity: Is it happening near our audience?
- Conflict: Are there opposing forces at play?
- Prominence: Does it involve well-known people or organizations?
- Impact: How many people will be affected by this event?
- Human Interest: Does the story evoke emotion?

1.2 The Structure of the Newsroom
A typical broadcast newsroom is a hierarchical organization designed for speed and efficiency.
- News Director: The head of the news department, responsible for the overall editorial direction and budget.
- Executive Producer: Oversees the production of specific newscasts.
- Assignment Editor: The "air traffic controller" of the newsroom, responsible for monitoring police scanners, tracking developing stories, and assigning reporters and camera crews.
- Reporter: The journalist on the ground, responsible for gathering facts, conducting interviews, and writing the story.
- Anchor: The face of the newscast, responsible for presenting the news to the audience.

1.3 Writing for Broadcast
Writing for radio and television is very different from writing for print. In broadcast journalism, you are writing for the ear, not the eye. The language must be conversational, clear, and concise. 
- Keep sentences short.
- Use active voice (e.g., "The police arrested the suspect," not "The suspect was arrested by the police").
- Read your copy aloud before submitting it. If you stumble over a sentence, the anchor probably will too.`
  }
];

const INITIAL_CATEGORIES = [
  { _id: 'c1', name: 'Software Engineering' },
  { _id: 'c2', name: 'Computer Science' },
  { _id: 'c3', name: 'Law & Jurisprudence' },
  { _id: 'c4', name: 'Accounting & Finance' },
  { _id: 'c5', name: 'Mass Communication' }
];

export function getMockDB() {
  // Ensure the directory exists
  const dir = path.dirname(MOCK_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // If the file does not exist, or if we want to enforce high-quality seeds
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const defaultDB = { books: INITIAL_BOOKS, categories: INITIAL_CATEGORIES };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(defaultDB, null, 2), 'utf-8');
    return defaultDB;
  }

  try {
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Check if the mock books are using old amazon image URLs, or if we want to enforce the expanded 12-book catalog
    if (parsed.books && parsed.books.length < 12) {
      parsed.books = INITIAL_BOOKS;
      parsed.categories = INITIAL_CATEGORIES;
      fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading mock DB file:', error);
    return { books: INITIAL_BOOKS, categories: INITIAL_CATEGORIES };
  }
}

export function saveMockDB(data: any) {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to mock DB file:', error);
  }
}
