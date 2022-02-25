/** 当图片的长宽任意一边大于2048 就进行等比缩放
 *  @param {Object} fileObj
 *  回调函数有一个参数，为对象 里面包含一个图片id与图片的url
 */
import {
    PutImageAPI
} from "@/api/MyApi";
// import {
//     Notification
// } from 'element-ui';
import {
    Toast,
    Dialog
} from 'vant'
// import { resolve } from "core-js/fn/promise";
export function compress(fileObj, callback) {
    try {
        const image = new Image()
        image.src = URL.createObjectURL(fileObj) //URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        console.log(image.onload, "imageimageimageimage")
        image.onload = function () { //onload 事件在图片加载完成后立即执行。
            const that = this
            // 默认按比例压缩

            console.log(that.width, "that.width")
            console.log(that.height, "that.height")
            console.log(fileObj.size, "fileObj")
            if (fileObj.size > 3 * 1024 * 1024) {
                Toast('上传图片不能超过3M！');
                return false;
            }
            if (that.width < 2048 && that.height < 2048) { //都小于2048的话
                // console.log(fileObj, "fileObj")
                //上传到阿里云
                let formData = new FormData();
                // console.log(fileObj, "fileObj")
                formData.append("file", fileObj);

                PutImageAPI(formData, "post", 2).then(res => {
                    console.log( res.data," res.data")
                    callback({
                        imgId: res.data[0].id,
                        imgUrl: res.data[0].imgPath
                    })
                }).catch(err => {
                    console.log(err, "err")
                    Toast('上传失败');
                    return false;
                })
                //上传到阿里云
            } else {
                let biggerOne = that.width > that.height ? that.width : that.height
                const scale = 2048 / biggerOne //当图片的长宽任意一边大于2048 就进行等比缩放
                let w = that.width * scale
                let h = that.height * scale
                let quality = 0.90 // 默认图片质量为0.90
                // 生成canvas
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                // 创建属性节点
                const anw = document.createAttribute('width')
                anw.nodeValue = w
                const anh = document.createAttribute('height')
                anh.nodeValue = h
                canvas.setAttributeNode(anw)
                canvas.setAttributeNode(anh)
                ctx.drawImage(that, 0, 0, w, h)
                // 图像质量
                if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
                    quality = fileObj.quality
                }
                // quality值越小，所绘制出的图像越模糊
                const data = canvas.toDataURL('image/jpeg', quality)
                // 压缩完成执行回调
                const newFile = dataURLtoFile(data, fileObj.name)
                //上传到阿里云
                let formData = new FormData();
                formData.append("file", newFile);
                PutImageAPI(formData, "post", 2).then(res => {
                    // console.log(res)
                    if (res.code) {
                        callback({
                            imgId: res.data[0].id,
                            imgUrl: res.data[0].imgPath
                        })
                    } else {
                        callback({
                            errCode: "网络错误!"
                        })
                    }

                }).catch(err => {
                    Toast('上传失败');
                    return false;
                });
                //上传到阿里云
            }
        }
    } catch (e) {
        console.log(e.msg)
    }
}

export function compression(fileObj) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = URL.createObjectURL(fileObj) //URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        image.onload = function () { //onload 事件在图片加载完成后立即执行。
            const that = this
            if (that.width < 2048 && that.height < 2048) { //都小于2048的话
                resolve(fileObj)
            } else {
                // 默认按比例压缩
                let biggerOne = that.width > that.height ? that.width : that.height
                const scale = 2048 / biggerOne //当图片的长宽任意一边大于2048 就进行等比缩放
                let w = that.width * scale
                let h = that.height * scale
                let quality = 0.90 // 默认图片质量为0.85
                // 生成canvas
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                // 创建属性节点
                const anw = document.createAttribute('width')
                anw.nodeValue = w
                const anh = document.createAttribute('height')
                anh.nodeValue = h
                canvas.setAttributeNode(anw)
                canvas.setAttributeNode(anh)
                ctx.drawImage(that, 0, 0, w, h)
                // 图像质量
                if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
                    quality = fileObj.quality
                }
                // quality值越小，所绘制出的图像越模糊
                const data = canvas.toDataURL('image/jpeg', quality)
                // 压缩完成执行回调
                const newFile = dataURLtoFile(data, fileObj.name)
                resolve(newFile)
            }
        }
    })
}

function dataURLtoFile(dataurl, filename) { //将base64转换为文件
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
        type: mime
    });
}