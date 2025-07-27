"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = exports.curlFormat = void 0;
exports.curlFormat = "{\"namelookup\": %{time_namelookup}, \"connect\": %{time_connect}, \"starttransfer\": %{time_starttransfer}, \"total\": %{time_total}, \"size_upload\": %{size_upload}, \"size_download\": %{size_download}, \"speed_upload\": %{speed_upload}, \"speed_download\": %{speed_download}, \"url\": \"%{url}\", \"ip\": \"%{remote_ip}\"}";
var Categories;
(function (Categories) {
    Categories["social"] = "social";
    Categories["finance"] = "finance";
    Categories["gaming"] = "gaming";
    Categories["dev"] = "dev";
})(Categories || (exports.Categories = Categories = {}));
