#!/bin/bash
/opt/gitlab/embedded/bin/runsvdir-start&
gitlab-ctl reconfigure
service ssh start
echo "Server listening..."
tail -f /dev/null