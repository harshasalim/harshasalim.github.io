---
title: Tech Learnings
type: tech
description: Technical learning journey and knowledge sharing
---

*Note - This information could be outdated, as I append what I learn on to this doc:)*

## Notes
- Couldnt use KotlinLogger in IntelliJ project - this was because in Maven Central it is added as a runTimeOnly dependency, but it should be used during  compile time as well - this caused mu(microutils) to be an unresolved reference. 
    - Found this - Try to change kotlin-logging-jvm to compile time dependency (not runtime only). This is the correct one for jvm projects.
    - Changed runtimeOnly to implementation and it works as expected

- For separate profiles(dev/prod), use separate application-profile.yml files apart from the default application.yml. 
    - The default file should have the following mandatorily:
    ```java
    spring:
        application:
            name: name
    ```

- Include the src/test/unit and integration directories in sourceSets{test{java}} in build.gradle
- DTO - Data Transfer Object to map from json to db - can be a data class- controller works with this
- Entity - can also be a data class - to persist data to db - service works with this
- Why separate entity and DTO?
    - If together we are tying the DB model with the client contract - which should be avoided

- Mocking an interface, that would be injected via constructor into a service is not straightforward mocking
    - Annotate service test class with ```java @ExtendWith(MockKExtension::class)```
    - ```java @InjectMockKs``` needs to be used to annotate the service
    - You need to do ```java MockKAnnotations.init(this)``` and then explicitly initialize the service with the constructor injection of interface in a function annotated with ```java @BeforeEach```

- Mocking a function that returns an Optional, like findById for CrudRepository, gives an error when we try to return a class object - so return ```java Optional.of(Class object)```

- Mocking a function that returns nothing - I initially used returns Unit()
    - The correct way to do this - every {} just runs
- Annotation use-site targets - to specify validator annotations in kotlin, we also need to specify the use site - where @get, or @field, or @param
    - Eg: 
    ```java
    @get:NotBlank(message = "courseDTO.name must not be blank") 
    val name : String
    ```
- While using Validations, ensure that you use @Validated for controller class and @Valid for request body
- ControllerAdvice pattern is used to handle exceptions: annotate the exception class with 
    ```java 
        @Component 
        @ControllerAdvice
    ```
    - Can override specific exception handler function : 
    ```java override fun handleMethodArgumentNotValid```
    - Can also create a function to handle a specific type of functions : then annotate that function with ```java @ExceptionHandler(Exception::class)```
    - Both cases - return a ```java return ResponseEntity``` with both status and body

- To test repo functions, annotate the repo test class with ```java @DataJpaTest```
- Retrieve data using 
    - JPA Query Creation Function - the function name creates the queries
    - Native SQL Query - use SQL directly
- Parameterized tests - to run a test with multiple sets of data 
    - Use annotations ```java @ParameterizedTest```
    - there is an input and corresponding output to be mentioned
        - Create a function in companion object that returns a ```java Stream<Arguments> ```
        - Use annotation ```java @JvmStatic``` so that Java can recognize it 
        ```java return Stream.of(Arguments.arguments("Plants",2), Arguments.arguments("Animals",1))```
    - In the parameterized test, use annotation ```java @MethodSource("input-output-function-name")``` to refer to the input-output function


- PostgreSQL course, during trial experimented with installing PostgreSQL in system. Multiple ways - PGAdmin tool to manage already created servers, via docker - started a docker postgres container and exec into it, then ran psql -U postgres to connect to postgres server. 
- Mockaroo to create bulk records in database 


- SSO - Single Sign On - Single authentication for multiple applications, where the app requests the identity provider(SSO system) for token and then gives the user access to the app. If no token the identity provider asks the user to sign in first to create the token
- Kerberos - A computer network security protocol that authenticates service requests between two trusted hosts across an untrusted network. It uses secret key cryptography and a trusted 3rd party for authenticating client-server applications and verifying user identities. It has 3 components - client, server and Key Distribution Center (KDC). KDC authenticates and ticket grants.


- Ident Protocol used to identify the user of a particular TCP connection
- LDAP - Lightweight Directory Access Protocol used to locate data in a network. Used in storing and retrieving passwords
    An LDAP client(an app that supports LDAP) accesses the LDAP server(a directory service like Microsoft Active Directory) and authenticates
- RADIUS - Remote Authentication Dial In User Service used to authenticate. Similar to LDAP
    A RADIUS client(a vpn, router etc) sends a RADIUS Access Request to the RADIUS server(a background process that authenticates user credentials and checks user privileges in a central database or external directory service like Microsoft Active Directory) and the user is authenticated based on the sent credentials
- PAM - Pluggable Authentication Module - defines an API for managing and accessing credentials providers including LDAP/RADIUS. Multiple types of auth is supported


- JSON vs JSONB - both are similar, but JSON is stored in raw format while JSONB is stored in compressed binary format. Insertion is slower in JSONB due to the additional overhead of conversion, but querying is faster. Also JSONB offers indexing


- When you are referencing another entity in an entity, which itself calls the former entity, functions like toString can fall into infinite loop, as they would continue to call each other in order to convert to string. So ensure to override their toString functions
NotBlank validations cannot be applied to Integer fields - gives error  No validator could be found for constraint 'javax.validation.constraints.NotBlank' validating type 'java.lang.Integer'.
Be careful while mocking functions that modify args without returning anything - like repo.save() as their effects are not “Returned”



- Integration tests require a database to run, but cannot automatically connect to project db/db could also be down
- TestContainer requires docker to run, but gives an error if you have Colima - ​​
    ```java
    Could not find a valid Docker environment. Please see logs and check configuration

    java.lang.IllegalStateException: Could not find a valid Docker environment. Please see logs and check configuration

        at org.testcontainers.dockerclient.DockerClientProviderStrategy.lambda$getFirstValidStrategy$4(DockerClientProviderStrategy.java
    ```
- To solve this, use the following before running integration tests:
    ```java
    export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE = /var/run/docker.sock
    export DOCKER_HOST = “unix://${HOME}/.colima/docker.sock”
    ```



- mockkObject is used to mock an instance of a class, in order to access static properties/companion objects etc
- CommandLineRunner is used to execute something before running the app
- getOrThrow function is used to return something in get block, or throw error in throw block
- logStashMarker(logData) and logMessage used together
- CustomClaims added to JWT tokens to add more information
- import-mappings used in openapi to override creation of specific class, and for dependent classes to point to custom-written class
- openapi 5.4.0 has issues in implementing polymorphism - specifically that of oneOf, however a hack can be to use allOf in child classes alone, and leave a mapping in base class - this will generate code correctly, but the documentation would miss the polymorphic block

### Compiler Notes
- REPL - Read-eval-print-loop is a computer environment where single user inputs are read, evaluated and results are returned to the user. Eg. bash
- gofmt formats go programs
- direnv is an extension for shell that exports env variables to a directory if a .envrc/.env file is present in it
    - You need to run direnv allow once for the new env file to be trusted
- brew search package-name to view all available associated packages
- brew doctor to check if brew installation is good
- Compiler - create tokens from input(lexical analysis) and construct abstract syntax tree from it to evaluate 
- You can define multiple constants in Go under one const(key1=value1, key2=value2) block
- Testing in go - https://pkg.go.dev/testing
- Go basics - https://gobyexample.com/
- Slices in go are similar to vectors in C++, arrays and slices initialized with 0 equivalent values
- Lookahead needed for a lexer to peek into the subsequent characters especially useful for multi character keywords
- Fetch from a map returns the value and a bool that says if the value is present
- fmt.Print() and fmt.Println() cannot format anything, just print. If we are formatting stuff, use fmt.Printf() - we can ‘\n’ to it if we need a newline as well
- Parsing - construct parse tree/abstract syntax tree from tokens
- Abstract syntax trees are ‘abstract’ because they omit certain details from tokens - whitespaces, semicolon, newlines, comments, braces, bracket and parentheses
- Parser generator - tools yacc, bison or ANTLR which generates parsers as output when you give a formal description of a language as input. These parsers can accepts code as input and produce syntax trees
    - Most of them accepts CFGs as input
        - Describes the syntax or structure of a language
        - https://www.geeksforgeeks.org/what-is-context-free-grammar/
        - S -> VUT, where LHS(S) can only be variable, but RHS can be variable/terminal/combination of both
    - Common CFG - Backus Naur Form
    - Common CFG - Extended Backus Naur Form
- Types of parsing - top-down parsing and bottom-up parsing
    - Types of top-down parsing - recursive descent parsing, early parsing, predictive parsing
    - Recursive descent parser - top down operator precedence parsing - also called Pratt parser
- Expressions produce values, statements dont
    - Return 5 is a statement, add(5,7) is an expression
    - Let x = 5 is a statement, 5 is an expression

### Go Notes
- For functions in go, if multiple consecutive parameters are of the same type, then we can list just their names followed by common type when defining these functions
- Variadic functions can be called with any number of trailing arguments
- Some functions may have multiple return values
- Go supports anonymous functions which can form closures: 
    ```go
    func intSeq() func() int {
        i := 0
        return func() int {
            i++
            return i
        }
    }

    nextInt := intSeq()

    fmt.Println(nextInt())
    fmt.Println(nextInt())
    fmt.Println(nextInt())
    ```
    Here closure is over i, so subsequent calls to nextInt, increments the i value and returns it<br>
    Closures can also be recursive but they need to be declared as a var explicitly before they are defined


### Keyboard Shortcuts
[Google sheet](https://docs.google.com/document/d/1AaTKhW2-TLYnEt3tufX8jz1XhDZ6EBB_C7u_5Wy4Y8g/edit?tab=t.0#heading=h.qdv4o3fu97sw)

### Flutter notes
**Issue - dart:io not available on Flutter web**<br>
Refer :   
1. https://flutter.dev/docs/development/platform-integration/web#can-i-use-dartio-with-a-web-app
2. https://github.com/flutter/flutter/issues/45782
3. https://github.com/flutterchina/dio/issues/580
<br>
The file system is not accessible from the browser. Hence dart:io not available on Flutter web. But most Multipart File(form-data) requests(including the default constructor) cause this error :
Uncaught (in promise) Error: Unsupported operation: MultipartFile is only supported where dart:io is available.
Hence use the “fromBytes” extension with the constructor.

**Issue/Note - Lack of availability of Flutter secure_storage for Web Apps**<br>
Refer :	https://github.com/mogol/flutter_secure_storage/issues/96<br>
The above suggests possible solutions:
1. Credential Management API : https://developers.google.com/web/fundamentals/security/credential-management/retrieve-credentials  -  Limitation : Cannot store arbitrary key-value pairs, not 100% secure
2. Two Tokens : CSRF validation must be done on the backend with a separate token you store in localStorage and send along with each request. The backend must send the JWT as an httpOnly cookie, so any frontend package can't really touch it. : https://carmine.dev/posts/flutterwebjwt/
3. Hive : https://github.com/hivedb/hive  -  Limitation : doesn't support IE Edge Trident properly, need the encryption key to be stored securely when app is closed

**Note - Methods to identify platform**<br>
Refer : 
1. https://github.com/flutter/flutter/issues/41311
2. https://api.flutter.dev/flutter/foundation/kIsWeb-constant.html

**Issue - flutter_map not available in Web**<br>
Refer : 
1. https://github.com/fleaflet/flutter_map/issues/440
2. https://github.com/fleaflet/flutter_map/issues/660<br>
The map does not load, and shows a blank screen. The package is dependent on flutter_image(which also does not support Flutter Web), to use the TileProvider. Also, there is no provision for zooming in and out of the map.<br>
Workaround : Define a custom class for TileProvider that uses NetworkImage(which does not cache tiles) - it renders the map, however loading takes time(due to absence of cache). For zooming in and out, wrap the map widget with a listener to detect scroll changes, and using MapController change the zoom value accordingly. 

**Issue - Search Bar not available in Flutter**<br>
No component currently available in Flutter for a SearchBar or a Text Field with an overlay drop down list. <br>
Possible solutions:
1. flutter_search_bar and flappy_search_bar packages - not well maintained 
2. Designing a custom search bar - Text Field + Overlay List - causes issues if a modal/drawer is also present in the same page (Could not find a solution). Furthermore, Text Field also has issues related to focus - cannot unfocus a TextField by clicking outside it. ( possible solution - add a listener to listen to touches outside the textfield, and manually unfocus the text field in such cases )
3. Current solution - Implemented the same result of flappy_search_bar - Text Field + Container below it showing a scrolling list of buttons. 

**Note - Deep Linking in Flutter Web**<br>
Refer:
1. https://rodydavis.medium.com/deep-linking-for-flutter-web-a34c2c181df0
2. fluro | Flutter Package (pub.dev)<br>
Ensure that while adding a link of type ‘/bar/foo’, there is also a destination defined for ‘/bar’

**Note - Adding Notifications support(JS) in Flutter**<br>
Refer:
1. Web Push SDK (onesignal.com)
2. dart:js library - Dart API
3. calling javascript from Dart - Stack Overflow - specifically  https://stackoverflow.com/a/56227833<br>
Create a separate JS file with the required JS inside a function, declare the function using the annotation JS(‘’), and then call it when needed.

### Blockchain vs Databases
Blockchain is a distributed ledger technology that enables a set of peers to work together to create a unified, decentralized network. The peers can communicate and share information or data with the help of the consensus algorithm. Also, there is no need for a centralized authority, which makes the whole network trustworthy when compared to other networks.

Let’s take a look at an example to understand how blockchain works. When one peer sends information to another, a transaction is generated. When this happens, the transactions need to be validated using the consensus algorithm.

In this case, Proof of Work is used to validate the work. It ensures that no invalid transactions are passed into the blockchain. Blockchain is all about blocks. They are used to store transactions and other important information that is required to operate the blockchain successfully.

Timestamps are created to ensure that each transaction can be traced, backed, and verified by anyone. The whole system adds value and brings in new features such as transparency, immutability, and security.

What Is a Database?<br>
With the idea of blockchain clear, it is now time for us to understand the database. The database, unlike blockchains, are a centralized ledger that is run by an administrator.

Databases also exhibit unique features, including the ability to read and write. Here, only the parties with proper access can do Write and Read actions. Databases also exhibit the ability to store multiple copies of the same data and their history. This is done with the help of a trusted, centralized authority who manages the server.

Centralization brings many benefits to the database. For example, it is easy to manage databases as the data is centralized. Accessing and storing data is not only easy but also fast. However, they also have drawbacks.

One of the biggest drawbacks is the chance of the data getting corrupted. To overcome the disadvantage, multiple backups are taken. But, that’s not always the case, as most of the entities always trust their owner and hence skip the backup data option. Another big drawback is how the data can be modified by anyone who is in control of the database itself. This can happen as the database is centralized in nature.

Despite having the features mentioned above, blockchain still lacks some features which traditional database has. The inclusion of the database features will leverage the blockchain with low latency, high throughput, fast scalability, and complex queries on blockchain data. Thus having the features of both blockchain and database, the application enhances its efficiency and security. Many of the blockchain platforms are now integrating with a database. In recent years, many blockchain databases have been developed and introduced. These distributed databases have their consensus mechanism for the joint agreement on a data block by the network parties. These blockchain databases support features like complex data types, rich query structure, ACID compliant, low latency, fast scalability, and cloud hosting. The adoption of database features in blockchain or vice-versa is an interesting research topic. Few industries have already built their blockchain database with all the required features. Many companies, including database giants IBM, Oracle, and SAP, as well as startups such as FlureeDB, BigchainDB, have devoted their efforts to develop blockchain database solutions to support SQL-like queries. 

Blockchain and database both can achieve many functionalities and features by coping with each other. If we frame blockchain as a database to provide a storage mechanism, then we can analyze how it differs from actual database systems. The following are the key points where blockchain and database differ in their properties, but both can leverage and enhance the characteristics of each other.
• Traditional blockchain throughput decreases when the processing capacity of nodes participating in the blockchain increases. Yet, in the case of the distributed database, the throughput increases when the nodes increases. Hence throughput can be enhanced. 
• The latency of transactions in blockchain is usually high compared to the latency in database. Thus, the latency can be made low as desired with the use of a database. 
• Transactions in blockchain require serializable isolation, which can be achieved by consensus algorithms providing strong consistency. For the databases, there is a well-understood mechanism called 2-phase locking and concurrency-control. However, new blockchain databases such as BlockchainDB based on MongoDB start to offer new transaction mechanisms based on blockchain. 
• Most of the blockchain platforms do not support complex queries in its historic data. These queries are needed in many applications to retrieve the desired information. The complex query feature is available in most of the databases, but the provenance queries on historic data can be supported by the use of Multi-Version Concurrency Control. 
• The decentralization feature of blockchain has rewired most of the financial systems and industries from the last decade. Decentralization is not available in the traditional distributed database. With the advent of new blockchain style databases, the decentralization is now possible and leads a promising growth to be used in many applications. 
• One of the other excellent features of blockchain is immutability or tamper-resistance of transactions. This tamper-resistance can be achieved in database systems by mechanisms that disallow the deletes and updates in the database. 
• Blockchain allows the creation and movement of digital assets, which is not allowed in a classical database. But, a blockchain-style distributed database can have this feature as a built-in feature.

In more details, CAP theorem identifies the three specific system properties for any distributed/decentralized system. These properties are Consistency, Availability and Partition Tolerance. • Consistency - Any read in the distributed system gives the latest write on the nodes. • Availability - A Client always receives a response at any point of time irrespective of whether the read is the latest write. • Partition Tolerance - In case of partition between nodes in the distributed system, the system should still be functioning. 
CAP theorem states that it is possible to achieve two of these three properties as guaranteed features in a distributed network, but it is impossible to achieve all three features at the same time. In practice, a distributed system always needs to be partition tolerant, thus leaving us to choose one property from Consistency or Availability. Hence, there is a trade-off between consistency and availability.

CAP theorem has also made its influence in the blockchain realm (see, for example). If we pick Availability over Consistency, any reads are not guaranteed to be up-to-date, and we call the system as AP. However, if we choose Consistency over Availability, the system, called CP, would be unavailable at the time of partition and might disrupt the consensus. Thus in blockchain systems, both properties are desirable. Though blockchain does not always require strong consistency, eventual consistency can serve the purpose and can be achieved through consensus. For example, in the case of bitcoin, the longest chain method brings eventual consistency, but there are no fix methods to achieve eventual consistency and leaves this topic for debate. Figure 1 shows the different database systems according to the CAP theorem. An analogy to the CAP theorem for blockchain have been proposed as the DCS theorem, where DCS abbreviation refers to Decentralization, Consistency, Scalability. The DCS theorem states that a blockchain system can have at most two properties simultaneously out of the three estates of DCS. The DCS properties can be defined as follows: • Decentralization - There is no trusted entity controlling the network, hence no single point of failure. Blockchains are inherently decentralized, but in the DCS triangle, we are considering the case of full decentralization. In the case of full decentralization, any node can join the network and participate as a validator. • Consistency - The blockchain nodes will read the same data at the same time. The query for the blockchain data on any blockchain node should fetch the same result. The consistency in blockchain should prevent doublespending and should be brought from the consensus algorithm used. • Scalability - The performance of blockchain should increase with the increase in the number of peers and the number of allocated computational resources. The throughput and the capacity of the system should be high, and latency should be low. In a similar way to CAP, we can also categorize the blockchain systems in DCS as DC, CS, and DS systems as trade-offs between the DCS properties. Most of the cryptocurrencies like Bitcoin can be considered as DC systems. Nevertheless, all the permissioned blockchains do not have full decentralization, hence should be regarded as CS systems. 

Systems like Interplanetary File System (IPFS) do not provide consistency as the different parts of data are distributed to different nodes (thus, they are DS systems). Figure 2 depicts the different systems, according to the DCS theorem. If we apply a similar relaxation approach as it was used for the proof of the CAP theorem in, we have the following reasoning: In DC systems, scalability is a big issue. Hence, to solve the scalability, many techniques are proposed, such as Sharding, Lightening network, or by using the scalable consensus algorithms. Furthermore, in DS systems, the consistency can be achieved by using the safe and verifiable smart contracts, by making the blockchain attack resilient and by handling the forks. Therefore in a way, all the DCS properties are achievable with some appropriate relaxations and balances. Here for blockchain systems, we postulate the following conjecture for achieving all three properties: Conjecture 1 (DCS-satisfiability): There exist a wellbalanced and relaxed set of requirements for Decentralization, Consistency, and Scalability (DCS) properties such that a blockchain system can have all three properties satisfied. While for the CAP theorem, the relaxation of the requirements was achieved by the introduction of the t-connected consistency model, a precise analogous mathematical modeling for the blockchain systems is an active and open field of research. 

Refer:
1. [tendermint.com](https://tendermint.com)
2. Structure of a transaction
3. [Bigchain transaction  - Key concepts of BigchainDB](https://github.com/bigchaindb/BEPs/tree/master/13)
3. [SHA256 Algorithm Explained - The Best Cryptocurrency Hashing Algorithm](https://cryptosoftwares.com/sha256-algorithm-best-cryptocurrency-hashing-algorithm/)

### Critical Path Method
If the duration of each activity in a project is known, Critical Path Method can be used to determine the amount of time it will take to complete the project. Moreover, Critical Path Method can be used to determine how much an activity can be delayed without delaying the overall completion of the project. Any project with interdependent activities can apply this method of mathematical analysis.

CPM breaks down larger projects into smaller, discrete tasks and maps them out on their logical sequence. To design the critical path, all of the required tasks that  are needed to complete the project, the time each task is expected to take and the dependencies between the activities are listed.Then calculate the longest path from beginning to end and the earliest each activity can start and the latest it can finish without causing the project to fall behind schedule. This constitutes the critical path, and any delay on it will cause the project itself to be delayed.

Critical path schedules will:- 
- Help you identify the activities that must be completed on time in order to complete the whole project on time.
- Show you which tasks can be delayed and for how long without impacting the overall project schedule.
- Calculate the minimum amount of time it will take to complete the project. 
- Tell you the earliest and latest dates each activity can start on in order to maintain the schedule. 

The Critical Path Method has four key elements:- 
- Critical Path Analysis
- Float Determination
- Early Start & Early Finish Calculation
- Late Start & Late Finish Calculation 

Critical Path Analysis:-
Critical path is the sequence of activities that has the longest duration. Activities on the critical path cannot be delayed without delaying the entire project.

Float Determination:-
Float is the amount of time an activity can be delayed before it causes your project to be delayed. Float is also called as slack. 

Calculating float:
Every activity on the critical path has a float of zero.
For the rest of the activities, float is calculated by subtracting the path time of the 
current path from the path time of the critical path.

Early Start & Early Finish Calculation:-
Early start time is the earliest possible time at which an activity may start
Early finish time is the earliest possible time at which the activity may be completed, it is calculated by adding the early start time and the duration of the activity.

Late Start & Late Finish Calculation:-
Late start time is the latest possible time at which the activity may start without delaying the project .
Late finish time is the latest possible time at which the activity can be finished without delaying the project. It is calculated by adding late start time and the duration of the activity.

Terms used:-
- Duration: Duration is the estimated time required to complete an activity.
- Dummy activity: It’s a fictious activity with zero duration and cost.
- Early start time: The earliest possible time at which an activity may start, is called early start time.
- Early finish time: The sum of the earliest start time of an activity and the time required for its completion is called early finish time.
- Late start time: The latest possible time at which an activity may start without delaying the date of the project, is called late start time.
- Late finish time: The sum of the late start time of an activity and the time required for its completion is called late finish time.
- Total float: The difference between the maximum time allowed for an activity and its estimated duration is called total float. It is the duration of time by which the activity can be started late, without disturbing the project schedule. It is generally denoted by S.
- Free float: The duration of time by which the completion time of an activity can be delayed without affecting the start of succeeding activities is called free float. It is generally denoted by S.F.
- Critical activities: The event which has no float, are called critical activities. The critical events are required to be completed on schedule.
- Critical path: The path in the network joining the critical events is called the critical path of the work.
 
Advantages of CPM: - The important advantages of CPM technique are: 
1. It helps in ascertaining the time schedule of activities having a sequential relationship. 
2. It makes control easier for the management. - small delay in any task, make up in subsequent tasks => easily cannot lose control
3. It identifies the most critical elements in the project. Thus, the management is kept alert and prepared to pay due attention to the critical activities of the project. 
4. It makes better and detailed planning possible. 

Limitations of CPM: - The main limitations of the CPM are: 
1. CPM operates on the assumption that there is a precise known time that each activity in the project will take. But, it may not be true in real practice. 
2. CPM time estimates are not based on statistical analysis. - statistical analyses account for uncertainty and error in the results; ensure that all aspects of a study follow the appropriate methods to produce trustworthy results.
3. It cannot be used as a controlling device for the simple reason that any change introduced will change the entire structure of the network. In other words, CPM cannot be used as a dynamic controlling device.
4. Shortened Timelines and Crash Action
5. Resource Allocation and Application

---

*This page is a WIP, and tracks my continuous journey of learning.* 