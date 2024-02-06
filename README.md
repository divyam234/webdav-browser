# Rclone Browser

Simple UI for browsing rclone remotes and much more.

### SetUp

```sh
rclone serve webdav remote:  --allow-origin "*"
```

**Enter http://127.0.0.1:8080 on Web Dav Url**

### Why Webdav not Remote Control API

- Rclone Remote Control API doesn't support VFS cache for serving file so for listing files webdav api is used.

**If you want to server multiple remote use combine remote**

```conf
[combined]
type = combine
upstreams = drive=gdrive: onedrive=onedrive:
```

```sh
rclone serve webdav combined:  --allow-origin "*"
```

**Use this [rclone](https://github.com/divyam234/rclone).There is bug in original rclone's libhttp cors headers for now use this until its fixed.**
