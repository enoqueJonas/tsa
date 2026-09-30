import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const missingShell:LearningResource={title:"MIT Missing Semester — The Shell",url:"https://missing.csail.mit.edu/2020/course-shell/",kind:"course"};
const gitBook:LearningResource={title:"Pro Git — Git Basics",url:"https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository",kind:"reference"};
const gitBranch:LearningResource={title:"Pro Git — Git Branching",url:"https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell",kind:"reference"};
const mdnHttp:LearningResource={title:"MDN — Overview of HTTP",url:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview",kind:"reference"};
const missingData:LearningResource={title:"MIT Missing Semester — Data Wrangling",url:"https://missing.csail.mit.edu/2020/data-wrangling/",kind:"course"};

type Spec={id:string;title:string;body:string;practice:string[];resources:LearningResource[]};
function make(s:Spec):Lesson{const blocks:LessonBlock[]=[{type:"paragraph",text:s.body},{type:"callout",tone:"note",title:"Boundary",body:"This lesson builds enough workstation fluency to begin Builder. Platform Builder later teaches operating-system, Linux and networking administration in depth; Delivery Engineer later teaches delivery automation and advanced CI/CD workflows."},{type:"resources",title:"Continue learning",resources:s.resources}];return{id:`engineering-workbench-${s.id}`,title:s.title,activities:[{id:`engineering-workbench-${s.id}-reading`,title:s.title,estimatedMinutes:50,content:{type:"reading",body:s.body,blocks}},{id:`engineering-workbench-${s.id}-lab`,title:`Lab: ${s.title}`,estimatedMinutes:75,content:{type:"practical",objective:`Demonstrate working fluency with ${s.title}.`,scenario:"Use a disposable local workspace and a small repository. Preserve command/output evidence and explain what each important operation changes.",instructions:s.practice,deliverables:["Working artifact or repository evidence","Short command/inspection log","Explanation of one mistake or failure and its correction"],completionCriteria:["The learner can repeat the workflow without copying an opaque command sequence.","Commands are chosen from a mental model of files/repository/network behavior.","Destructive operations are recognized before execution."]}}]}}
const shellFilesystemLesson: Lesson = {
 id: "engineering-workbench-shell-filesystem",
 title: "Terminal, Shell and Filesystem",
 activities: [
  {
   id: "engineering-workbench-shell-filesystem-reading",
   title: "Terminal, Shell and Filesystem",
   estimatedMinutes: 70,
   content: {
    type: "reading",
    body: "A terminal gives you a text interface to a shell. The shell reads commands, starts programs and connects their input and output. Filesystem paths tell those programs which objects to inspect or change. This lesson builds a mental model of those three layers before you rely on command recipes.",
    blocks: [
     {type:"paragraph",text:"A terminal, a shell and a command-line program are related but different. The terminal is the window or interface carrying text input and output. The shell is a program such as zsh, bash or PowerShell that interprets what you type. Commands such as pwd, ls and git are built-ins or programs the shell invokes. Keeping those layers separate helps you diagnose whether a problem is syntax, shell behavior, a missing program or the program itself."},
     {type:"heading",id:"shell-command-model",text:"1. From a prompt to a running command",level:2},
     {type:"paragraph",text:"When you enter a command, the shell first interprets shell syntax: words, quoting, variable expansion, pipes and redirections. It then resolves the command name and invokes the appropriate built-in or executable with arguments. The program runs, produces an exit status and may write to output streams. This is why punctuation such as quotes, | and > is not merely decoration: the shell may act on it before the target program starts."},
     {type:"code",language:"shell",caption:"A command, an option and an argument",code:"ls -la ~/tsa",output:"The shell resolves ls, passes -la and the expanded home-directory path as arguments, and ls produces the directory listing."},
     {type:"callout",tone:"note",title:"Inspect before changing",body:"A reliable command-line habit is: establish where you are, inspect the target, predict the effect, then change it. pwd and ls are cheap evidence before cp, mv or rm."},

     {type:"heading",id:"shell-filesystem-tree",text:"2. The filesystem is a tree",level:2},
     {type:"paragraph",text:"Think of the filesystem as a tree of directories. A directory can contain files and other directories. Your shell has a current working directory: the location from which relative paths are interpreted. On Unix-like systems, / is the filesystem root. Your home directory is commonly abbreviated as ~. A single dot means the current directory and two dots mean its parent."},
     {type:"code",language:"shell",caption:"Establish location and inspect it",code:"pwd\nls\nls -la",output:"pwd prints the current working directory. ls shows ordinary entries. ls -la also exposes hidden dot-files and metadata."},
     {type:"paragraph",text:"Hidden files on Unix-like systems are normally names beginning with a dot, such as .gitignore. They are not a separate kind of file; normal listings simply omit them unless requested."},

     {type:"heading",id:"shell-paths",text:"3. Absolute and relative paths",level:2},
     {type:"paragraph",text:"An absolute path identifies a location from the root and does not depend on your current directory. A relative path is interpreted from the current directory. If your current directory is /Users/ana/projects, then notes/todo.txt refers to /Users/ana/projects/notes/todo.txt, while ../archive refers to /Users/ana/archive."},
     {type:"code",language:"shell",caption:"The same target through different path expressions",code:"cd ~/projects\npwd\ncat notes/todo.txt\ncat ~/projects/notes/todo.txt"},
     {type:"callout",tone:"warning",title:"Relative paths depend on state",body:"A relative command can be correct in one directory and wrong in another. When a command says 'file not found', inspect pwd and the target path before changing the command blindly."},

     {type:"heading",id:"shell-safe-file-operations",text:"4. Read state before you mutate it",level:2},
     {type:"paragraph",text:"mkdir creates directories; touch can create an empty file or update timestamps; cp copies; mv moves or renames; rm removes. These operations are simple, but their path arguments determine their scope. Unlike a graphical trash workflow, command-line removal may be immediate. Treat destructive commands as state changes that require inspection."},
     {type:"code",language:"shell",caption:"A disposable workspace",code:"mkdir -p ~/tsa-shell-lab/notes\ncd ~/tsa-shell-lab\nprintf 'first note\\n' > notes/one.txt\ncp notes/one.txt notes/backup.txt\nls -la notes\ncat notes/backup.txt"},
     {type:"paragraph",text:"Notice the sequence: create a bounded workspace, move into it, write known data, copy it, then inspect the result. The commands are evidence-producing steps, not a magic sequence to memorize."},

     {type:"heading",id:"shell-quoting",text:"5. Words, whitespace and quoting",level:2},
     {type:"paragraph",text:"The shell normally uses whitespace to separate words. Quoting lets spaces or shell-significant characters remain part of one argument. Single quotes preserve text literally in common Unix shells; double quotes keep text together while still allowing expansions such as $HOME. Unquoted variables can be split or expanded in surprising ways, so quote values when you mean one argument."},
     {type:"code",language:"shell",caption:"Why quoting changes arguments",code:"mkdir -p 'release evidence'\nprintf '%s\\n' "$HOME"\nprintf '%s\\n' '$HOME'",output:"Double quotes expand HOME; single quotes print the characters $HOME literally."},

     {type:"heading",id:"shell-streams",text:"6. Standard input, output and error",level:2},
     {type:"paragraph",text:"A process normally starts with three standard streams. Standard input (stdin) is where input can arrive. Standard output (stdout) carries normal output. Standard error (stderr) carries diagnostics. Keeping stdout and stderr conceptually separate lets tools compose and lets failures remain visible."},
     {type:"code",language:"shell",caption:"Normal output and diagnostic output are different streams",code:"ls notes\nls does-not-exist",output:"The first command writes a listing to stdout. The second writes a diagnostic to stderr and returns a non-zero status."},

     {type:"heading",id:"shell-pipes-redirection",text:"7. Pipes and redirection compose programs",level:2},
     {type:"paragraph",text:"A pipe connects one process's stdout to another process's stdin. Redirection connects a stream to or from a file. The shell creates these connections before starting the programs. > replaces a file with stdout; >> appends stdout. Use them deliberately: redirecting to the wrong file can destroy previous contents."},
     {type:"code",language:"shell",caption:"Transform output without manually copying it",code:"printf 'alpha\\nbeta\\nalpha\\n' > words.txt\ncat words.txt | sort | uniq -c\ngrep 'alpha' words.txt > alpha.txt\ncat alpha.txt",output:"The pipeline counts adjacent unique values after sorting. The final redirection stores only matching lines in alpha.txt."},
     {type:"callout",tone:"note",title:"Avoid useless pipes once you understand the model",body:"Many tools can read files directly, for example grep 'alpha' words.txt. The important lesson is the stream model, not maximizing the number of | characters."},

     {type:"heading",id:"shell-environment",text:"8. Environment variables carry process configuration",level:2},
     {type:"paragraph",text:"Environment variables are named values inherited by child processes. They are commonly used for configuration such as PATH, environment names or tool settings. They are not a secure secret store. A shell variable and an exported environment variable are not always the same thing; export makes a value available to subsequently started child processes in common Unix shells."},
     {type:"code",language:"shell",caption:"Create and inspect temporary process configuration",code:"export TSA_ENV=learning\nprintf '%s\\n' "$TSA_ENV"\nenv | grep '^TSA_ENV='",output:"The current shell expands TSA_ENV and a child process can receive the exported value."},

     {type:"heading",id:"shell-exit-status",text:"9. Exit status is machine-readable success or failure",level:2},
     {type:"paragraph",text:"When a command finishes it returns an integer exit status. By convention, zero means success and non-zero means some form of failure. Shells, scripts and CI systems use that status to decide what happens next. Printed text and exit status are different signals: a program can print useful output and still fail."},
     {type:"code",language:"shell",caption:"Inspect the previous command's status in zsh/bash",code:"test -f words.txt\nprintf 'status=%s\\n' "$?"\ntest -f missing.txt\nprintf 'status=%s\\n' "$?"",output:"The existing file produces status 0. The missing-file condition produces a non-zero status."},

     {type:"heading",id:"shell-help",text:"10. Discover commands instead of guessing",level:2},
     {type:"paragraph",text:"Professional command-line work includes discovering unfamiliar options safely. Start with command --help where supported, man command on Unix-like systems, or the tool's built-in help. Check usage before copying an option from memory, especially for commands that mutate files."},
     {type:"code",language:"shell",caption:"Inspect before using an unfamiliar option",code:"ls --help 2>/dev/null || man ls\ngit help status"},
     {type:"callout",tone:"note",title:"Platform boundary",body:"This lesson builds workstation fluency. Platform Builder later teaches Linux and operating-system administration, permissions, services, networking and production operations in depth. You are learning to reason at a developer shell, not to administer a server."},

     {type:"heading",id:"shell-debugging",text:"11. Diagnose from evidence",level:2},
     {type:"paragraph",text:"When a command fails, resist changing several things at once. Ask: What directory am I in? What exact path did the shell construct? Does the target exist? Did quoting change the arguments? Did the program run and return an error, or could the shell not find the program? What exit status did it return? This turns terminal work from trial-and-error into engineering."},
     {type:"code",language:"shell",caption:"A small diagnostic sequence",code:"pwd\nls -la\nprintf 'PATH=%s\\n' "$PATH"\ncommand -v git\ngit --version\nprintf 'status=%s\\n' "$?""},

     {type:"heading",id:"shell-summary",text:"Mental model to keep",level:2},
     {type:"list",ordered:true,items:["The terminal carries text interaction; the shell interprets command syntax.","Your current working directory gives relative paths their meaning.","The shell resolves commands and prepares arguments, expansions, pipes and redirections.","Programs read input, change or inspect state, write stdout/stderr and return an exit status.","Inspect state before mutation and use help when you do not understand an option."]},
     {type:"resources",title:"Continue learning",resources:[{...missingShell,recommended:true,read:"Shell lecture and exercises",purpose:"Reinforce the shell/filesystem mental model with additional demonstrations after TSA has taught the core concepts."},{...missingData,read:"Pipes and data-wrangling sections",purpose:"Extend the stream-composition model once pipes and redirection are understood."}]}
    ]
   }
  },
  {
   id: "engineering-workbench-shell-filesystem-guided",
   title: "Guided Practice: Build and Inspect a Shell Workspace",
   estimatedMinutes: 35,
   content: {
    type: "practical",
    objective: "Apply paths, quoting, streams, environment variables and exit status in a disposable workspace while predicting each state change.",
    scenario: "You are preparing a tiny evidence workspace for an engineering task. Work only inside a disposable directory. Before each mutating command, inspect the current state and state what you expect to change.",
    instructions: [
     "Create a disposable tsa-shell-practice directory under your home directory, enter it, and prove your location with pwd.",
     "Create input and output subdirectories. Create a text file whose filename contains a space; use quoting correctly and prove the exact filename with ls -la.",
     "Write at least five lines of sample data, then use a pipe to filter or transform it. Explain which process produces stdout and which consumes stdin.",
     "Redirect the transformed output into a new file, inspect it, then append one additional line without replacing the existing contents.",
     "Export TSA_PRACTICE=guided, verify it in the shell and prove a child process can observe it.",
     "Run one command that succeeds and one controlled command that fails. Capture and explain their exit statuses.",
     "Use built-in help to discover one option you did not previously know. Apply it only after explaining what it should do."
    ],
    deliverables:["Command/output transcript for the workspace","Before/after explanation for two state-changing commands","Short explanation of one pipe, one redirection and two exit statuses"],
    completionCriteria:["Every command is confined to disposable data.","The learner can explain paths and streams without relying on the command sequence.","A controlled failure is diagnosed from evidence rather than hidden."]
   }
  },
  {
   id: "engineering-workbench-shell-filesystem-check",
   title: "Knowledge Check: Terminal, Shell and Filesystem",
   estimatedMinutes: 15,
   content: {
    type: "reflection",
    prompt: "Without running commands first, reason through these situations:\n\n1. You are in ~/projects/api and a command refers to ../logs/app.log. What path relationship does that express, and what evidence would you inspect if the file is not found?\n\n2. Explain what the shell does differently in: printf '%s\\n' \"$HOME\" and printf '%s\\n' '$HOME'.\n\n3. In cat app.log | grep ERROR > errors.txt, identify stdin/stdout relationships and which component performs the redirection.\n\n4. A command prints an error and the next value of $? is 2. What does that tell you, and what does it not tell you?\n\n5. Why is pwd/ls before rm an engineering habit rather than unnecessary ceremony?",
    minimumCharacters: 450
   }
  },
  {
   id: "engineering-workbench-shell-filesystem-lab",
   title: "Lab: Terminal, Shell and Filesystem",
   estimatedMinutes: 75,
   content: {
    type: "practical",
    objective: "Demonstrate independent command-line fluency from a mental model of shell interpretation, paths, streams and process results.",
    scenario: "A teammate gives you a directory of plain-text run evidence. Build a safe local workflow that organizes it, extracts selected lines into a report and leaves enough command/output evidence for another engineer to reproduce your result. Choose your own disposable names and structure rather than copying the guided-practice layout.",
    instructions:[
     "Create and inspect a bounded disposable workspace using a mix of absolute and relative paths.",
     "Create representative evidence files, including at least one hidden file or filename requiring quoting.",
     "Use safe read/search commands plus at least one meaningful pipeline to derive information from the files.",
     "Use redirection deliberately to create and then append to a report; explain why the chosen operator does not destroy unintended data.",
     "Use a temporary environment variable as configuration for one command or scriptable step and explain process inheritance.",
     "Produce one controlled failure, use exit status plus inspection evidence to diagnose it, and correct the underlying cause.",
     "Use command help/manual information to solve one part of the task without relying on a memorized option.",
     "Before any destructive cleanup, show the target scope and explain what will be removed."
    ],
    deliverables:["Reproducible workspace/report artifact","Annotated command and output evidence","Diagnostic note for the controlled failure","Short explanation of how paths, shell interpretation, streams and exit status interacted in the workflow"],
    completionCriteria:["The workflow can be repeated without an opaque copied command sequence.","The learner predicts important state changes before executing them.","Pipes/redirection and quoting are used with correct explanations.","Failure diagnosis identifies evidence and cause rather than trial-and-error.","Destructive scope is inspected before execution."]
   }
  }
 ]
};

const specs:Spec[]=[
{id:"git-version-control",title:"Git and Version-Control Workflow",body:"Git records a graph of project history. Learn working tree, staging area, commits, branches, HEAD, diffs, remotes and merge/conflict concepts before memorizing team workflows. A commit should represent an understandable change. Inspect before staging, stage intentionally, review the diff, commit, and know how to recover from common local mistakes without deleting history blindly.",practice:["Initialize a repository and make several focused commits.","Use status and diff before staging/committing.","Create a feature branch, change the same file meaningfully and integrate it back.","Create and resolve a controlled merge conflict while explaining the competing versions.","Add a remote or explain fetch/pull/push semantics using a safe repository; do not force-push as a routine fix."],resources:[gitBook,gitBranch]},
{id:"developer-inspection",title:"Developer Inspection: Processes, Ports and Text",body:"Before administering systems, a developer should be able to inspect the local environment enough to answer basic questions: what process is running, what command started it, what port it listens on, where output/logs appear, and whether a file or environment value contains the expected data. The goal is diagnosis, not Linux administration.",practice:["Start a small local HTTP server or development process.","Identify the process and listening endpoint using tools available on your OS.","Capture stdout/stderr and search relevant text output.","Stop/restart the process intentionally and distinguish process failure from application response failure.","Record the minimal evidence another engineer would need to reproduce the observation."],resources:[missingShell,mdnHttp]},
{id:"http-command-line",title:"HTTP from the Command Line",body:"Builder will teach web/API engineering, but the learner should first experience a request as observable data. Use a command-line HTTP client to inspect URL, method, status, headers and body. Distinguish DNS/connection/TLS failures from an HTTP response at a conceptual level without attempting to learn networking administration yet.",practice:["Send GET and POST requests to a safe public or local test endpoint.","Inspect status, selected headers and response body separately.","Change one request input and compare the response.","Trigger or observe a client error and distinguish it from an HTTP 4xx/5xx response.","Save one reproducible request as evidence for the Builder starting point."],resources:[mdnHttp]},
];
export const engineeringApprenticeWorkbenchDeepLessons:Lesson[]=[shellFilesystemLesson,...specs.map(make)];