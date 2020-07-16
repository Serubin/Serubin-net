FROM jekyll/jekyll AS builder

WORKDIR /opt/serubin-net/

# Cache yarn and gem layer
COPY package.json ./
COPY Gemfile ./
COPY Gemfile.lock ./

RUN yarn
RUN bundle install

COPY . /opt/serubin-net/
RUN chown  -R jekyll:jekyll /opt/serubin-net

RUN mkdir -p dist/assets/js

# Build node/js/scss assets - also save bundle.min.js in /tmp/
RUN yarn build:site && cp -r dist/assets/js /tmp/bundle

# Build static site
RUN yarn build:static

# jekyll build overwrites dist - so copy and paste assets/js from /tmp/
RUN mkdir -p dist/assets/js && mv /tmp/bundle/* dist/assets/js


# Load image
FROM nginx:alpine
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /opt/serubin-net/dist /var/www/html
