start_time=`date +%s`
../bin/pub-html.sh

echo Lapse $(expr `date +%s` - $start_time) 