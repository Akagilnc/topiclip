(function(window, document, undefined) {
'use strict'
var host = 'http://songzhumei.local/topiclip/'
// var host = 'http://120.24.19.157:8090/topiclip/'
var API_root = 'api'
var API_host = host + API_root

var App = window.App = {}
var Util = App.Util = {}
var Api = App.Api = {}
var Consist = App.Consist = {}
var Config = App.Config = {}
var Page = App.Page = {}
var Check = App.Check = {}
var Route = App.Route = {
top: 'index',
contact: 'contact'
}
/*
* on domContentLoaded
*/
$(function () {
var pathname = window.location.href.match(".+/(.+?)([\?#].*)?$")[1]
/*
* all
*/
Util.dispatcher('.', function () {
Page.all.init()
Page.top.init()
})
/*
* each page
*/
if (pathname.indexOf(Route.contact) != -1) {
Util.dispatcher(Route.contact, function () {
Config.currentPage = Route.contact
Page.contact.init()
})
}
// dispatch
Util.dispatcher(pathname)
})

Consist.input_msg = {
"empty": "入力は必要です",
"email": "メールアドレスを正しく入力してください",
"phone": "電話番号を正しく入力してください",
"error": "正しく入力してください"
}
Consist.response_msg = {
"success": "送信済み",
"fail":"送信処理に失敗しました。後ほど再度お試しください。"
}

/*
* ajax
*/
Util.ajax = function (_option) {
var baseUrl = _option.url
var query = {}
var $defer = $.Deferred()
$.extend(query, _option.params)
if (_option.params) {
baseUrl = baseUrl + '?' + $.param(query)
}
var opt = {
url: API_host.path_join(baseUrl),
type: _option.type,
dataType: _option.dataType,
data: _option.data,
success: $defer.resolve,
error: $defer.reject
}
$.ajax(opt)
return $defer.promise()
}

Util.animate = function () {
var $scroll = $('.scroll'),
window_scroll_top
var animation = function () {
window_scroll_top = $(window).scrollTop()
$scroll.each(function () {
if (window_scroll_top + window.innerHeight >= $(this).offset().top) {
$(this).addClass('is-scoped')
}
})
}
var bind = function () {
$(window).scroll(function () {
animation()
})
}
bind()
animation()
}

/*
* dispatcher
*/
Util.dispatcher = function (path, callback) {
this.path_func = this.path_func || []
if (callback) return this.path_func.push([path, callback])
for (var i = 0, l = this.path_func.length; i < l; ++i) {
var func = this.path_func[i]
var match = path.match(func[0])
match && func[1](match)
}
}

/**
* form_control
*/
Util.form_control = {
clear: function (_option) {
var length = Util.json.get_length(_option)
var key_arr = Util.json.key_arr(_option)
for (var i = 0; i < length; i++) {
$('#' + key_arr[i]).val('')
}
},
error: function (key, err) {
var $item = $('#' + key)
var text = "<p class='err-text err-" + key + "'>" + err + "</p>"
$item.after(text)
},
error_remove: function ($item) {
var key = $item.attr('id')
var $err = $('.err-' + key)
if ($err.length === 1) {
$item.removeClass('error')
$err.remove()
}
},
keydown: function ($input) {
$input.on('keydown', function (e) {
var keydown = e.which
if (keydown == 13) {
e.preventDefault()
var nxt_idx = $input.index(this) + 1
$input.eq(nxt_idx).focus()
}
})
}
}

Check.email = function (email) {
email = email || ''
return (email.length > 3 && email.indexOf('@') > -1)
}
Check.number = function (number) {
var numberreg = /^\+?[1-9][0-9]*$/
return (numberreg.exec(number))
}
Check.phone = function (phone) {
var phonereg = /^((\d{3,4}-)?\d{7,8})?(1[3587]\d{9})?$/
return (phonereg.exec(phone) && phone.length == 11)
}
//verify of form
Check.item_verify = function (key, value, callback) {
if (key === 'company' || key === 'name' || key === 'email') {
if (value === '') {
return callback(Consist.input_msg.empty)
}
if (key === 'email') {
if (!Check.email(value) || value.length > 100) {
return callback(Consist.input_msg.email)
}
}
}
if (key === 'phone') {
if (value && ( !Check.number(value) || value.length > 50)) {
return callback(Consist.input_msg.phone)
}
} else if ((key != 'question') && value.length > 100) {
return callback(Consist.input_msg.error)
}
}

Util.json = {
key_arr: function (option) {
var key_arr = []
for (var key in option) {
key_arr.push(key)
}
return key_arr
},
get_length: function (option) {
var length = 0
for (var item in option) {
length++
}
return length
}
}

Util.loading = {
begin: function () {
$('.loading-con').removeClass('hidden');
$('.body').addClass('no-scroll');
},
end: function () {
$('.loading-con').addClass('hidden');
$('.body').removeClass('no-scroll');
}
}

/*
*modal
*/
Util.modal = function (id) {
$(id).modal({
backdrop: true,
keyboard: true
});
$(window).on('shown.bs.modal', function () {
$('body').addClass('no-scroll')
})
$(window).on('hidden.bs.modal', function () {
$('body').removeClass('no-scroll');
})
}

Util.nav = {
animate: function (item, class_name) {
$(window).scroll(function () {
var $animated = $(item)
if ($animated.length && $animated.offset().top > 2) {
$animated.addClass(class_name)
} else {
$animated.removeClass(class_name)
}
})
},
active: function (item, class_name) {
$(item).addClass(class_name)
},
collapse: function () {
var menu_collapse = function () {
$('.collapse').collapse('toggle')
}
if ($(window).width() < 768) {
$('.nav-item a').on('click', function () {
menu_collapse()
})
}
}
}

Util.smooth_scroll = (function () {
$('a.page-scroll').click(function () {
var target = $(this.hash)
target = target.length ? target : $('[name=' + this.hash.slice(1) + ']')
if (target.length) {
$('html,body').animate({
scrollTop: target.offset().top - 40
}, 900)
return false
}
})
})()

Util.localStorage = {
get: function (key) {
var value = localStorage.getItem(key) || "{}"
return JSON.parse(value)
},
remove: function (key) {
localStorage.removeItem(key)
},
set: function (key, value) {
localStorage.setItem(key, value)
}
}

/*
* String helper
*/
Util.string = (function () {
return {
path_join: function () {
String.prototype.path_join = function () {
var current = this,
args = Array.prototype.slice.call(arguments)
args.forEach(function (elem, i) {
var ending = current[current.length - 1],
starting = elem[0]
if (ending !== '/')
current = current + '/'
if (starting === '/')
current += elem.substring(1)
else
current += elem
})
return current
}
},
format: function () {
String.prototype.format = function () {
var formatted = this
for (var i = 0; i < arguments.length; i++) {
var regexp = new RegExp('\\{' + i + '\\}', 'gi')
formatted = formatted.replace(regexp, arguments[i])
}
return formatted
}
},
insert: function () {
Array.prototype.insert = function (index, item) {
this.splice(index, 0, item)
}
},
DBC2SBC: function (string) {
if (string) {
var result = ""
var len = string.length
for (var i = 0; i < len; i++) {
var c_code = string.charCodeAt(i)
c_code = (c_code >= 0xFF01 && c_code <= 0xFF5E) ? (c_code - 65248) : c_code
//空格处理
c_code = (c_code == 0x03000) ? 0x0020 : c_code
result += String.fromCharCode(c_code)
}
return result
}
}
}
})()

/**
*swiper
*/
Util.swiper = function () {
var mySwiper = new Swiper('.swiper-container', {
slidesPerView: 1.3,
spaceBetween: 0,
slidesPerGroup: 1,
loopFillGroupWithBlank: true,
navigation: {
nextEl: '.swiper-button-next',
prevEl: '.swiper-button-prev'
},
centeredSlides: true,
updateOnImagesReady: true,
observer: true,
observeParents: true,
prevButton: '.swiper-button-prev',
nextButton: '.swiper-button-next'
})
}

Api.form = function ($) {
var submit = function (_option) {
var $defer = $.Deferred()
var options = {
type: 'post',
url: 'contacts.php',
data: _option
}
Util.ajax(options).done(function (result) {
$defer.resolve(result)
}).fail(function (xhr) {
$defer.reject(xhr)
})
return $defer.promise()
}
return {
submit: submit
}
}(jQuery)

Page.all = (function () {
var init = function () {
Util.string.path_join()
Util.string.format()
Util.nav.collapse()
Util.animate()
}
return {
init: init
}
})()

var has_err
var form_verify = function ($dom, callback) {
var key = $dom.attr('id')
var _value = $dom.val()
var value = $.trim(Util.string.DBC2SBC(_value))
$('#' + key).val(value)
Check.item_verify(key, value, function (err) {
Util.form_control.error(key, err)
if (callback)return callback(true)
})
}
var input_handle = function ($input) {
$input.each(function () {
var $input = $(this)
$input.on('blur', function () {
form_verify($input)
})
$input.on('focus', function () {
Util.form_control.error_remove($input)
})
})
Util.form_control.keydown($input)
}
var form_submit = function () {
var $form = $('#form_item')
var $input = $form.find('input')
var $textarea = $form.find('textarea')
var option = {
"company": "",
"name": "",
"email": "",
"phone": "",
"question": ""
}
input_handle($input)
$form.on('submit', function (e) {
e.preventDefault()
var option_len = Util.json.get_length(option)
var key_arr = Util.json.key_arr(option)
var $err_text = $('p.err-text')
//remove last submit err_info
$input.removeClass('error')
$err_text.remove()
//form item verify
for (var i = 0; i < option_len; i++) {
var option_key = key_arr[i]
var $item = $('#' + option_key)
option[option_key] = $item.val()
form_verify($item, function (err) {
has_err = err
})
}
//ajax
if (!has_err) {
Util.loading.begin()
Api.form.submit(option)
.done(function (obj) {
Util.form_control.clear(option)
Util.loading.end()
Util.modal('#myModal')
})
.fail(function (err) {
Util.loading.end()
alert(Consist.response_msg.fail)
console.log(err)
})
}
})
}
Page.contact = (function () {
var init = function () {
bind()
}
var bind = function () {
form_submit()
}
return {
init: init
}
})()

Page.top = (function () {
var init = function () {
Util.nav.animate(".nav-animated", "is-scroll")
Util.swiper()
}
return {
init: init
}
})()

})(window, document)
