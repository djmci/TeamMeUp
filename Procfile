web: bundle exec puma -p ${PORT:-3000} -e production -t 4:16
worker: bundle exec sidekiq -t 25 -c ${SIDEKIQ_WORKERS:-10} -q default -q mailers
