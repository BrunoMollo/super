
#!/bin/bash
# This is a script used by Bruno to start developing quickly 

echo "   _____                          "
echo "  / ___/ __  __ ____   ___   _____"
echo "  \__ \ / / / // __ \ / _ \ / ___/"
echo " ___/ // /_/ // /_/ //  __// /    "
echo "/____/ \__,_// .___/ \___//_/     "
echo "            /_/                   "

# Name of the tmux session
SESSION_NAME="super"


# Install dependencies 
if  ls | grep -q "node_modules" ;
  then
    echo "Setup Ready"
  else
    cp .env.example .env
    pnpm i
fi


# Check if the session exists
tmux has-session -t $SESSION_NAME 2>/dev/null

if [ $? != 0 ]; then
  # Create a new session and window 1
  tmux new-session -d -s $SESSION_NAME -n "editor"
  tmux send-keys -t $SESSION_NAME:1 "vim" C-m
  
  # Create window 2
  tmux new-window -t $SESSION_NAME -n "server"
  
  tmux send-keys -t $SESSION_NAME:2 "docker compose up -d" C-m
  sleep 2
  tmux send-keys -t $SESSION_NAME:2 "pnpm seed" C-m
  tmux send-keys -t $SESSION_NAME:2 "pnpm dev" C-m


  tmux split-window -h -t $SESSION_NAME:2
  tmux send-keys -t $SESSION_NAME:2 "open https://local.drizzle.studio &" C-m
  tmux send-keys -t $SESSION_NAME:2 "pnpm inspect" C-m
  tmux resize-pane -t $SESSION_NAME:2 -x 20
fi

# Attach to the session
tmux attach -t $SESSION_NAME

