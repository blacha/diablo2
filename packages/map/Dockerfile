
# Build mapgen in a container
FROM ubuntu:20.04 as build

RUN apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests git -y \
    mingw-w64

RUN mkdir -p /build/map
COPY ./map /build/map
COPY ./build.mapgen.sh /build

WORKDIR /build
ARG GIT_VERSION
ENV GIT_VERSION ${GIT_VERSION}

ARG GIT_HASH
ENV GIT_HASH ${GIT_HASH}

RUN bash build.mapgen.sh

# Make a run environment with nodejs and wine
FROM tianon/wine:5

RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash \
    && apt-get install nodejs -yq

ENV WINEARCH=win32
ENV WINEDEBUG=-all


VOLUME [ "/app/game" ]

WORKDIR /app
RUN npm init  --yes
RUN npm install canvas@2.8.0

ADD dist/ /app/

COPY --from=build /build/bin/d2-map.exe /app/bin/d2-map.exe

ARG GIT_VERSION
ENV GIT_VERSION ${GIT_VERSION}

ARG GIT_HASH
ENV GIT_HASH ${GIT_HASH}

# Make sure InstallPath exists inside the registry
COPY d2.install.reg /app/
CMD ["node", "index.cjs"]
