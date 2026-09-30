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

const developerInspectionLesson: Lesson = {
 id:"engineering-workbench-developer-inspection",
 title:"Developer Inspection: Processes, Ports and Text",
 activities:[
  {id:"engineering-workbench-developer-inspection-reading",title:"Developer Inspection: Processes, Ports and Text",estimatedMinutes:65,content:{type:"reading",body:"A developer does not need to administer an operating system to gather useful local evidence. You should be able to connect four observations: a process exists, it was started by a command, it may listen on a network endpoint, and it emits text or logs that reveal what it is doing.",
   blocks:[
    {type:"paragraph",text:"When a local application 'doesn't work', jumping straight into its code is often premature. First establish whether the process started, whether it is still alive, whether it is listening where you expect, and what stdout/stderr or logs say. These observations separate execution problems from application-response problems."},
    {type:"heading",id:"inspect-process-model",text:"1. A running program is a process",level:2},
    {type:"paragraph",text:"An executable or script on disk is not the same as a running process. Starting a program creates a process with a process identifier (PID), arguments, environment, working context and open resources. A process can exit successfully, fail immediately, remain running, or spawn other processes."},
    {type:"code",language:"shell",caption:"Start a disposable local server",code:"mkdir -p ~/tsa-inspection && cd ~/tsa-inspection\nprintf 'hello from TSA\\n' > index.html\npython3 -m http.server 8765",output:"The command stays running and normally reports that it is serving on port 8765. Use a second terminal for inspection."},
    {type:"paragraph",text:"If python3 is unavailable, use another safe local development server available on your workstation. The capability being learned is inspection, not Python."},

    {type:"heading",id:"inspect-process",text:"2. Prove that the process exists",level:2},
    {type:"paragraph",text:"Process tools differ by operating system, but the questions are stable: What PID identifies the process? What command/arguments started it? Is it still running? On macOS/Linux, ps and pgrep are common inspection tools. Avoid killing a process merely because its name looks familiar; identify the exact PID and command first."},
    {type:"code",language:"shell",caption:"Inspect by command pattern on macOS/Linux",code:"pgrep -af 'http.server 8765'\nps -p <PID> -o pid,ppid,command",output:"Replace <PID> with the observed identifier. The output ties a running process to its parent and command."},

    {type:"heading",id:"inspect-ports",text:"3. A listening port is evidence of a network endpoint",level:2},
    {type:"paragraph",text:"A server process may ask the operating system to listen on an IP address and port. The port number alone is not 'the application'; it is part of an endpoint owned by a socket/process. If the process is alive but nothing is listening on the expected port, startup may be incomplete or configuration may differ."},
    {type:"code",language:"shell",caption:"Inspect the expected listener",code:"lsof -nP -iTCP:8765 -sTCP:LISTEN",output:"On macOS this can show the command, PID and listening TCP endpoint. Linux environments may use ss -ltnp when permitted."},
    {type:"callout",tone:"note",title:"Boundary",body:"You only need enough networking vocabulary here to connect a local process to an endpoint. Platform Builder later teaches interfaces, routing, DNS, firewalls, services and operating-system administration."},

    {type:"heading",id:"inspect-request",text:"4. Separate 'not running' from 'running but responding badly'",level:2},
    {type:"paragraph",text:"Once process and listener evidence exist, make a simple request. If a client cannot connect, that differs from receiving an HTTP error response: an HTTP response means a server at least accepted the connection and spoke HTTP. The next lesson develops this boundary further."},
    {type:"code",language:"shell",caption:"Observe the local server",code:"curl -i http://127.0.0.1:8765/",output:"A successful request should include an HTTP status/headers and the file body. The server terminal should also show a request log line."},

    {type:"heading",id:"inspect-output",text:"5. stdout, stderr and logs are execution evidence",level:2},
    {type:"paragraph",text:"Programs can write normal output and diagnostics to their standard streams, and applications may also write structured log files. Capture enough evidence to answer what happened without assuming every line is equally important. Timestamps, severity, request/correlation identity and the first causal error are often more useful than dumping thousands of lines."},
    {type:"code",language:"shell",caption:"Capture both output streams for a disposable command",code:"some-command > run.out 2> run.err\nprintf 'exit=%s\\n' "$?"\nwc -l run.out run.err"},
    {type:"paragraph",text:"Do not redirect a long-running server blindly during the first exercise if that makes its behavior harder to observe. The point is to understand where evidence goes."},

    {type:"heading",id:"inspect-text",text:"6. Search text to answer a question",level:2},
    {type:"paragraph",text:"Text tools are most useful when driven by a question. grep searches matching lines; head/tail sample boundaries; sort and uniq can summarize repeated values. Do not replace understanding with pipelines. State the question first, then choose the smallest transformation that answers it."},
    {type:"code",language:"shell",caption:"Search a small diagnostic file",code:"printf 'INFO started\\nERROR cannot load config\\nINFO stopped\\n' > app.log\ngrep -n 'ERROR' app.log\ntail -n 2 app.log",output:"The search identifies the error line and tail shows the final events."},

    {type:"heading",id:"inspect-lifecycle",text:"7. Stop and restart deliberately",level:2},
    {type:"paragraph",text:"Stopping the exact disposable server lets you observe the difference between a process failure and an application response. Use the PID you identified, stop it normally, prove that the process/listener disappeared, and then retry the client request. Restart it and prove the evidence returns."},
    {type:"callout",tone:"warning",title:"Identify before terminating",body:"Do not copy kill commands against production or shared processes. In this lesson, terminate only the disposable process you started and identified by PID/command."},

    {type:"heading",id:"inspect-diagnostic-ladder",text:"8. Use a diagnostic ladder",level:2},
    {type:"list",ordered:true,items:["What exact command did I start, and did it report an immediate error?","Does the expected process exist?","Does it own/listen on the expected local endpoint?","Can a client connect?","If connected, what response/status/body was observed?","What do stdout/stderr/logs show around the failure?","What single hypothesis can I test next without changing several variables?"]},
    {type:"resources",title:"Continue learning",resources:[{...missingShell,read:"Shell tools and job/process-related examples",purpose:"Reinforce local inspection habits after TSA has established the diagnostic model."},{...mdnHttp,read:"Client-server protocol overview",purpose:"Prepare for distinguishing connection evidence from HTTP response evidence in the next lesson."}]}
   ]}},
  {id:"engineering-workbench-developer-inspection-guided",title:"Guided Practice: Trace a Local Process",estimatedMinutes:35,content:{type:"practical",objective:"Trace one disposable local service from startup command to process, listener, request and output evidence.",scenario:"Start a local server on a non-privileged port and build an evidence chain before changing or stopping it.",instructions:["Start a disposable local HTTP server and preserve its startup output.","From another terminal, identify its PID and exact command.","Prove which endpoint/port it listens on using an OS-appropriate inspection tool.","Request it with curl and correlate the client result with server output.","Create/search a small text log for one precise diagnostic question.","Stop only the identified server process, prove process/listener absence, retry the request and classify the failure.","Restart it and prove the process/listener/request evidence returns."],deliverables:["Process/listener/request evidence chain","Commands used with short explanation of what each proves","Before/after evidence for stop and restart"],completionCriteria:["The learner distinguishes process existence, listener existence and application response.","Termination targets only the disposable identified process.","Text search is tied to a diagnostic question."]}},
  {id:"engineering-workbench-developer-inspection-check",title:"Knowledge Check: Processes, Ports and Evidence",estimatedMinutes:15,content:{type:"reflection",prompt:"1. A process appears in ps, but nothing is listening on the expected port. What does each observation prove and what hypotheses remain?\n\n2. curl returns an HTTP 500. Why is 'the server is down' a poor diagnosis?\n\n3. curl says connection refused after you stopped the process. How is that evidence different from an HTTP 404?\n\n4. Why should you identify PID and command before terminating a process?\n\n5. Given a 10,000-line log, describe how you would turn a concrete question into a small text-inspection strategy instead of reading randomly.",minimumCharacters:450}},
  {id:"engineering-workbench-developer-inspection-lab",title:"Lab: Developer Inspection",estimatedMinutes:70,content:{type:"practical",objective:"Independently diagnose the lifecycle of a disposable local service using minimal reproducible evidence.",scenario:"Create a small local service/process and produce an evidence packet another developer could use to distinguish startup, listener, response and shutdown states.",instructions:["Start a disposable local server or development process using a command you can explain.","Identify its process and command line without relying only on the startup terminal.","Identify its expected local listening endpoint when applicable.","Exercise it with a client and preserve the smallest useful response/output evidence.","Introduce one controlled failure such as stopping the process or changing the requested path; classify the observation at the correct layer.","Search/capture relevant text evidence and explain why it supports the diagnosis.","Restore the working state and prove recovery.","Write the minimal reproduction sequence another engineer would need."],deliverables:["Reproduction steps","Process/endpoint/output evidence","Controlled-failure diagnosis","Recovery evidence"],completionCriteria:["Evidence distinguishes execution, endpoint and application behavior.","Diagnosis follows observations rather than random changes.","The workflow stays within developer inspection and does not require system-administration changes."]}}
 ]
};

const httpCommandLineLesson: Lesson = {
 id:"engineering-workbench-http-command-line",
 title:"HTTP from the Command Line",
 activities:[
  {id:"engineering-workbench-http-command-line-reading",title:"HTTP from the Command Line",estimatedMinutes:65,content:{type:"reading",body:"An HTTP client turns a web interaction into inspectable request and response data. At Apprentice level, the goal is not API design; it is to recognize what you asked for, whether an HTTP response actually arrived, and what evidence that response contains.",
   blocks:[
    {type:"paragraph",text:"A browser hides many details for convenience. curl lets you make a request explicitly and inspect status, headers and body. This makes HTTP useful as an engineering observation surface before Builder teaches API implementation."},
    {type:"heading",id:"http-request-model",text:"1. A request has a target, method, headers and sometimes a body",level:2},
    {type:"paragraph",text:"A URL identifies a scheme, host, optional port, path and optional query. The HTTP method expresses the kind of request being made. Headers carry metadata such as accepted representation or content type. Some requests carry a body. These parts are distinct; changing one can change server behavior."},
    {type:"code",language:"shell",caption:"Inspect a simple GET",code:"curl -i https://example.com/",output:"-i asks curl to include response headers. Observe the HTTP status line, headers and body as separate evidence."},
    {type:"heading",id:"http-response-model",text:"2. An HTTP response proves more than 'the website worked'",level:2},
    {type:"paragraph",text:"A response contains a status code, headers and usually an optional body. A 2xx generally indicates successful handling; 3xx indicates redirection; 4xx indicates the server is reporting a client/request-side condition; 5xx indicates the server reports that it failed to fulfill the request. The exact meaning comes from the specific status and application contract."},
    {type:"callout",tone:"note",title:"A 404 is still an HTTP response",body:"If you receive HTTP 404, a server accepted the connection and returned an HTTP response. That is fundamentally different evidence from DNS failure, connection refusal or TLS negotiation failure."},

    {type:"heading",id:"http-curl-observation",text:"3. Make curl show the layer you are investigating",level:2},
    {type:"paragraph",text:"Use output options deliberately. -i includes response headers. -v shows connection/request diagnostics and can be noisy or sensitive, so do not paste verbose output containing credentials into reports. -o can save a body. -w can print selected transfer metadata such as the response code."},
    {type:"code",language:"shell",caption:"Separate body and status for inspection",code:"curl -sS -o response.html -w 'status=%{http_code}\\n' https://example.com/\nhead response.html",output:"The body is stored separately while curl prints the observed HTTP status code."},

    {type:"heading",id:"http-method-input",text:"4. Change one request input at a time",level:2},
    {type:"paragraph",text:"When comparing behavior, keep the experiment controlled. Change the path, query, method, header or body deliberately and compare the response. If you change several inputs at once, you lose evidence about which change mattered."},
    {type:"code",language:"shell",caption:"A JSON POST shape",code:"curl -i -X POST \\\n  -H 'Content-Type: application/json' \\\n  --data '{\"name\":\"steward\"}' \\\n  http://127.0.0.1:8765/items",output:"Use a safe endpoint that accepts POST when practicing. The method, content-type header and body are separate request inputs."},

    {type:"heading",id:"http-failure-layers",text:"5. Not every curl failure is HTTP",level:2},
    {type:"paragraph",text:"Before an HTTP response can exist, the client must resolve the target name when needed, establish a network connection and—when using HTTPS—complete TLS sufficiently to exchange HTTP. A failure before that point may have no HTTP status code at all."},
    {type:"list",items:["Name-resolution failure: the client cannot resolve the host to an address; no HTTP response exists.","Connection refused/unreachable: the client cannot establish the expected connection; no HTTP response exists.","TLS/certificate failure: secure negotiation/verification fails before normal HTTP exchange; usually no application HTTP response exists.","HTTP 4xx/5xx: an HTTP-speaking server returned a response. Investigate request/application behavior rather than calling it a connectivity failure."]},
    {type:"code",language:"shell",caption:"Controlled local comparison",code:"curl -i http://127.0.0.1:8765/missing\ncurl -i http://127.0.0.1:8766/",output:"If 8765 has the practice server, the first can return an HTTP response such as 404. If nothing listens on 8766, the second fails to connect and has no HTTP status."},

    {type:"heading",id:"http-headers",text:"6. Headers are protocol metadata, not decoration",level:2},
    {type:"paragraph",text:"Request headers can describe accepted media, content type, authorization and other context. Response headers can describe representation type, caching, correlation and server behavior. At this stage, learn to inspect relevant headers and avoid leaking sensitive ones."},
    {type:"callout",tone:"warning",title:"Credentials are evidence-sensitive",body:"Never paste real Authorization headers, session cookies, API keys or secrets into TSA evidence. Use safe public/local endpoints and redact sensitive values."},

    {type:"heading",id:"http-reproducibility",text:"7. A useful request is reproducible",level:2},
    {type:"paragraph",text:"When reporting an observation, preserve the smallest request that reproduces it: method, sanitized URL/path/query, relevant non-secret headers, safe body, observed status and relevant response excerpt. Also record enough environment/context to know what target was exercised."},
    {type:"heading",id:"http-diagnostic-sequence",text:"8. Diagnose in order",level:2},
    {type:"list",ordered:true,items:["What exact URL and method am I requesting?","Did curl itself reject the URL or input?","Could the target name be resolved when resolution is required?","Could a connection be established?","Did TLS fail before HTTP when HTTPS is used?","Did an HTTP status line arrive?","If so, what do status, relevant headers and body say?","Can I reproduce the observation while changing only one input?"]},
    {type:"callout",tone:"note",title:"Curriculum boundary",body:"Builder later teaches API contracts, server implementation and richer HTTP semantics. Platform Builder later teaches DNS, addressing, routing and network administration. Here you are learning to observe the boundary correctly."},
    {type:"resources",title:"Continue learning",resources:[{...mdnHttp,recommended:true,read:"HTTP overview: client-server protocol, messages and flow",purpose:"Reinforce the request/response model after TSA has taught how to observe it from the command line."}]}
   ]}},
  {id:"engineering-workbench-http-command-line-guided",title:"Guided Practice: Compare HTTP and Connection Failures",estimatedMinutes:35,content:{type:"practical",objective:"Use curl to inspect a request/response and distinguish an HTTP response from a pre-HTTP failure.",scenario:"Use the disposable local server from Developer Inspection or another safe endpoint. Change one request property at a time and preserve sanitized evidence.",instructions:["Send a GET to a known working target and identify method/URL, status, two relevant response headers and body.","Request a missing path and determine whether the result is an HTTP response. Explain the evidence.","Request a local port where nothing is listening and compare the client output with the previous HTTP error response.","Use curl options to save a response body separately from the status code.","If a safe POST-capable endpoint is available, send a small JSON body with an explicit Content-Type; otherwise construct and explain the command without sending it.","Repeat one request after changing exactly one input and compare the observed result."],deliverables:["Sanitized reproducible curl commands","HTTP-response versus connection-failure comparison","One controlled-input comparison"],completionCriteria:["The learner does not assign HTTP status codes to failures that produced no HTTP response.","Request and response components are identified separately.","Sensitive headers/data are absent from evidence."]}},
  {id:"engineering-workbench-http-command-line-check",title:"Knowledge Check: HTTP Observation",estimatedMinutes:15,content:{type:"reflection",prompt:"1. curl reports 'connection refused'. Why can you not truthfully report HTTP 500?\n\n2. You receive HTTP 404 with a JSON body. What layers have already succeeded enough for that evidence to exist?\n\n3. Explain the difference between a request header and response header using one example of each.\n\n4. You change the method, path and body and the response changes. Why is your experiment weak?\n\n5. What minimum sanitized evidence would you give another engineer so they can reproduce an HTTP observation?",minimumCharacters:450}},
  {id:"engineering-workbench-http-command-line-lab",title:"Lab: HTTP from the Command Line",estimatedMinutes:70,content:{type:"practical",objective:"Independently produce and diagnose reproducible HTTP observations from the command line.",scenario:"Investigate a safe local/test HTTP target as if you were preparing evidence for a Builder who will later inspect the application contract.",instructions:["Choose a safe target and record the exact sanitized request context.","Send a successful or expected request and separate status, relevant headers and body evidence.","Change one request input and explain the response difference.","Produce or observe one genuine HTTP error response such as a safe 4xx and prove that an HTTP response arrived.","Produce one controlled pre-HTTP failure, such as a non-listening local port, and explain why it has no HTTP status.","Save one response body or selected output reproducibly without exposing credentials.","Create a compact reproduction note containing only the evidence another engineer needs."],deliverables:["Reproducible sanitized request set","Response evidence","HTTP-vs-pre-HTTP failure diagnosis","Compact reproduction note"],completionCriteria:["The learner distinguishes client/connection/TLS boundaries from HTTP responses.","Status, headers and body are interpreted as separate evidence.","Experiments change inputs deliberately.","Evidence contains no secrets."]}}
 ]
};

export const engineeringApprenticeWorkbenchDeepLessons:Lesson[]=[shellFilesystemLesson,gitVersionControlLesson,developerInspectionLesson,httpCommandLineLesson];
