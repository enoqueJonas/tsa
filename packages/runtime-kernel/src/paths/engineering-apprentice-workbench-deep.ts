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

const gitVersionControlLesson: Lesson = {
 id:"engineering-workbench-git-version-control",
 title:"Git and Version-Control Workflow",
 activities:[
  {id:"engineering-workbench-git-version-control-reading",title:"Git and Version-Control Workflow",estimatedMinutes:75,content:{type:"reading",body:"Git is a version-control system built around snapshots connected into a history graph. Before learning a team workflow, learn where changes live: your working tree, the staging area (index), commits, branch references and remotes.",
   blocks:[
    {type:"paragraph",text:"Git becomes much easier when you stop treating add, commit, push and pull as a ritual. Each command moves information between distinct states. Most Git mistakes are recoverable when you first identify which state contains the version you want."},
    {type:"heading",id:"git-repository-model",text:"1. A repository contains history plus a working copy",level:2},
    {type:"paragraph",text:"A Git repository stores committed project history under .git. The files you edit are the working tree. Git compares the working tree, the staging area and the currently checked-out commit to tell you what changed. Deleting .git does not merely 'reset Git'; it removes the repository's local history and metadata."},
    {type:"code",language:"shell",caption:"Create a disposable repository and inspect its state",code:"mkdir -p ~/tsa-git-practice && cd ~/tsa-git-practice\ngit init\nprintf '# Steward Notes\\n' > README.md\ngit status",output:"README.md is untracked: it exists in the working tree but is not yet part of a commit."},

    {type:"heading",id:"git-three-states",text:"2. Working tree, staging area and commit",level:2},
    {type:"paragraph",text:"The working tree is what is currently on disk. The staging area (also called the index) is Git's proposed content for the next commit. A commit records a snapshot plus metadata and a parent relationship. git add does not save to GitHub and does not permanently commit a file: it updates the staging area."},
    {type:"code",language:"shell",caption:"Observe the transitions instead of memorizing add/commit",code:"git diff\ngit add README.md\ngit diff\ngit diff --staged\ngit commit -m 'docs: add project notes'\ngit status",output:"Before add, git diff shows the unstaged change. After add, ordinary diff is empty while --staged shows what the next commit will contain. After commit, status is clean."},
    {type:"callout",tone:"steward",title:"Commit intentionally",body:"A useful commit represents one understandable change. Review git diff and git diff --staged before committing so the recorded snapshot matches the story in the commit message."},

    {type:"heading",id:"git-history-graph",text:"3. Commits form a graph",level:2},
    {type:"paragraph",text:"A commit has an identifier and normally points to one or more parent commits. This produces a graph of history. HEAD identifies what you currently have checked out—usually indirectly through the current branch. A branch is a movable name pointing at a commit; it is not a separate copy of the entire project."},
    {type:"code",language:"shell",caption:"Make history visible",code:"printf 'first observation\\n' >> README.md\ngit add README.md && git commit -m 'docs: record first observation'\ngit log --oneline --graph --decorate --all",output:"The log shows commit identities, parent history and labels such as HEAD and the current branch."},

    {type:"heading",id:"git-branches",text:"4. Branches let history diverge safely",level:2},
    {type:"paragraph",text:"Creating a branch creates another reference to a commit. New commits advance the currently checked-out branch. Switching branches changes which committed snapshot is checked out and may update working-tree files. Keep uncommitted work visible with git status before switching."},
    {type:"code",language:"shell",caption:"Create a feature line of history",code:"git switch -c feature/runbook\nprintf 'Runbook draft\\n' > RUNBOOK.md\ngit add RUNBOOK.md && git commit -m 'docs: add runbook draft'\ngit log --oneline --graph --decorate --all"},

    {type:"heading",id:"git-diffs",text:"5. Diff is your inspection instrument",level:2},
    {type:"paragraph",text:"git status summarizes state; git diff shows content differences. Learn to ask a precise question: What did I change but not stage? What is staged for the next commit? What changed between two commits or branches? Inspection before mutation is as important in Git as it is in the shell."},
    {type:"list",items:["git status — classify working-tree/index state","git diff — working tree versus index","git diff --staged — index versus HEAD","git show <commit> — inspect a recorded commit","git log --oneline --graph --decorate --all — inspect history shape"]},

    {type:"heading",id:"git-merge",text:"6. Merge combines lines of history",level:2},
    {type:"paragraph",text:"When histories diverge, a merge asks Git to combine them. If changes do not conflict, Git can often combine them automatically. A merge conflict is not repository corruption: it means Git cannot safely decide how competing changes should become one result. A human must inspect intent, edit the resolved content, stage it and complete the merge."},
    {type:"code",language:"text",caption:"Typical conflict markers inside a file",code:"<<<<<<< HEAD\ncurrent branch text\n=======\nincoming branch text\n>>>>>>> feature/example"},
    {type:"paragraph",text:"The correct resolution is not 'delete the markers'. Decide what the final content should mean, edit it accordingly, test or inspect the result, then stage the resolved file."},

    {type:"heading",id:"git-remotes",text:"7. Local history and remote collaboration are separate",level:2},
    {type:"paragraph",text:"A remote is a named reference to another repository location, commonly origin. fetch downloads remote objects and updates remote-tracking references without merging them into your current branch. push sends local objects and asks the remote to update a reference. pull is a convenience operation that fetches and then integrates according to configuration; understanding fetch first makes pull less mysterious."},
    {type:"code",language:"shell",caption:"Inspect remote state rather than assuming it",code:"git remote -v\ngit branch -vv\ngit fetch origin",output:"Use these after a remote exists. fetch changes your knowledge of remote history; it does not automatically rewrite your working files."},
    {type:"callout",tone:"warning",title:"Do not normalize force-push as recovery",body:"A force push can rewrite shared branch history. It is sometimes legitimate under an explicit workflow, but it is not a generic fix for 'my push was rejected'. Inspect divergence first."},

    {type:"heading",id:"git-recovery",text:"8. Recover by identifying the wrong state",level:2},
    {type:"paragraph",text:"Before using a recovery command, classify the problem. Is the unwanted change only in the working tree? Is the wrong content staged? Was it committed locally? Was the commit already shared? Those are different situations with different safety constraints. git restore, reset, revert and reflog solve different problems; guessing among them can turn a small mistake into lost work."},
    {type:"list",items:["Unwanted unstaged edit: inspect diff, then restore only if you truly want to discard it.","Wrong staged content: adjust the index without assuming the working file must be deleted.","Bad committed change in shared history: a new revert commit is often safer than rewriting history.","Lost-looking local commit/reference: inspect log/reflog before concluding the work is gone."]},
    {type:"callout",tone:"note",title:"Boundary",body:"This lesson establishes local Git reasoning and basic remote semantics. Delivery Engineer later owns CI/CD and release workflows. Team-specific branching policies are conventions layered on top of this Git model."},

    {type:"heading",id:"git-model-summary",text:"Mental model to keep",level:2},
    {type:"list",ordered:true,items:["Edit in the working tree.","Inspect changes.","Stage exactly the snapshot intended for the next commit.","Inspect the staged diff.","Commit an understandable change into the history graph.","Use branches as movable references for divergent work.","Inspect divergence before merging, rebasing, pulling or pushing.","Choose recovery based on where the unwanted state lives."]},
    {type:"resources",title:"Continue learning",resources:[{...gitBook,recommended:true,read:"Getting a Git Repository through Viewing the Commit History",purpose:"Reinforce the repository, staging and commit model with the canonical Pro Git explanation."},{...gitBranch,read:"Branches in a Nutshell and Basic Branching and Merging",purpose:"Deepen the commit-graph model after TSA has introduced branches and merges."}]}
   ]}},
  {id:"engineering-workbench-git-version-control-guided",title:"Guided Practice: Trace a Change Through Git",estimatedMinutes:40,content:{type:"practical",objective:"Trace changes deliberately through working tree, index, commits and branches.",scenario:"Use a disposable repository. At every checkpoint, predict what git status/diff will show before running it.",instructions:["Initialize a repository and create one tracked text file.","Modify it and compare git status, git diff and git diff --staged before and after staging.","Make two focused commits and draw their parent relationship from git log --graph.","Create a feature branch, make one commit there and prove which branch/commit HEAD identifies.","Return to the original branch and compare the histories before integrating the feature.","Create a controlled non-conflicting merge and inspect the resulting graph.","Make an unstaged change you do not want; inspect it, then safely discard only that change and explain why no commit was lost."],deliverables:["Annotated status/diff checkpoints","Small commit-graph sketch tied to real commit IDs","Explanation of working tree vs index vs commit","Recovery note for the discarded unstaged change"],completionCriteria:["The learner predicts state before commands.","Staging and committing are explained as different transitions.","Branch behavior is explained from references/commits rather than 'copies of folders'."]}},
  {id:"engineering-workbench-git-version-control-check",title:"Knowledge Check: Git State and History",estimatedMinutes:15,content:{type:"reflection",prompt:"Reason without immediately running commands:\n\n1. A file appears under 'Changes not staged for commit'. Where does the changed version exist, and what would git add change?\n\n2. git diff is empty but git diff --staged shows changes. Explain the state.\n\n3. Two branch names point to the same commit. Are they two copies of the repository? What happens when you commit on one checked-out branch?\n\n4. Why is a merge conflict a request for human intent rather than evidence that Git is broken?\n\n5. Your push is rejected because the remote branch contains work you do not have. Why is force-push a dangerous first response, and what would you inspect first?",minimumCharacters:500}},
  {id:"engineering-workbench-git-version-control-lab",title:"Lab: Git and Version-Control Workflow",estimatedMinutes:90,content:{type:"practical",objective:"Demonstrate independent Git reasoning across local state, branching, integration, conflict resolution and remote semantics.",scenario:"Build a small documentation repository as if two lines of work must be integrated safely. Preserve history and evidence rather than optimizing for the fewest commands.",instructions:["Create a repository with several focused commits and explain why each commit is coherent.","Use status and both unstaged/staged diffs as evidence before at least two commits.","Create divergent branches and visualize the graph.","Create a controlled conflict by editing the same meaningful region differently on two branches. Resolve it based on intended final content and explain the decision.","Demonstrate one safe local recovery scenario after first identifying whether the problem is in the working tree, index or committed history.","Configure or use a safe remote if available; otherwise document fetch/push/remote-tracking semantics using the repository graph. Do not force-push.","Produce a final log graph and narrate how the history reached that state."],deliverables:["Disposable Git repository","Commit graph and annotated status/diff evidence","Conflict-resolution explanation","Recovery decision note","Remote-semantics explanation"],completionCriteria:["Commands are selected from the Git state model rather than a memorized workflow.","Commits are focused and inspected before recording.","Conflict resolution preserves intended meaning.","Recovery does not destroy unrelated work.","The learner distinguishes local branches from remote-tracking references."]}}
 ]
};

const specs:Spec[]=[
{id:"developer-inspection",title:"Developer Inspection: Processes, Ports and Text",body:"Before administering systems, a developer should be able to inspect the local environment enough to answer basic questions: what process is running, what command started it, what port it listens on, where output/logs appear, and whether a file or environment value contains the expected data. The goal is diagnosis, not Linux administration.",practice:["Start a small local HTTP server or development process.","Identify the process and listening endpoint using tools available on your OS.","Capture stdout/stderr and search relevant text output.","Stop/restart the process intentionally and distinguish process failure from application response failure.","Record the minimal evidence another engineer would need to reproduce the observation."],resources:[missingShell,mdnHttp]},
{id:"http-command-line",title:"HTTP from the Command Line",body:"Builder will teach web/API engineering, but the learner should first experience a request as observable data. Use a command-line HTTP client to inspect URL, method, status, headers and body. Distinguish DNS/connection/TLS failures from an HTTP response at a conceptual level without attempting to learn networking administration yet.",practice:["Send GET and POST requests to a safe public or local test endpoint.","Inspect status, selected headers and response body separately.","Change one request input and compare the response.","Trigger or observe a client error and distinguish it from an HTTP 4xx/5xx response.","Save one reproducible request as evidence for the Builder starting point."],resources:[mdnHttp]},
];
export const engineeringApprenticeWorkbenchDeepLessons:Lesson[]=[shellFilesystemLesson,gitVersionControlLesson,...specs.map(make)];