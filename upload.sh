#!/bin/bash
rsync -a --exclude "node_modules" . root@node.pymnts.com:/home/pymnts-score-card-cache/