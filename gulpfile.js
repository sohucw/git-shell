var gulp = require('gulp');
var less = require('gulp-less');
gulp.task('testLess', function () {
    gulp.src('src/less/index.less') // 该任务针对的文件
        .pipe(less()) // 该任务调用的模块
        .pipe(gulp.dest('src/css')); // 将会在src/css下生成 index.css
});
gulp.task('default',['testLess']);  // 定义默认任务

// gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
// gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
// gulp.dest(path[, options]) 处理完后文件生成路径


// 针对 gulp.src  globs变量的说明  src/*.js    src/**/*.js (包含src的0个或多个子文件夹下的js文件)
//  src/{a,b}.js 包含a.js 和 b.js src/*.{jpg,png,gif} src下的所有jpg png gif 文件
// ! !src/a.js  不包含src下的a.js文件

/*
* 压缩 文件的操作
* */
var htmlmin = require('gulp-htmlmin');
gulp.task('testHtmlMin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});

/*
* 操作图片
* */
var imagemin = require('gulp-imagemin');
gulp.task('testImageMin', function (){
    gulp.src('src/img/*.{jpg,jpeg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/img'));
});

/*
* 操作css
* */
var cssmin = require('gulp-minify-css');
gulp.task('testCssmin', function () {
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

/**
  给文件添加版本号      未成功
  * */
var rev = require('gulp-rev-append');
gulp.task('testRev', function () {
    gulp.src('src/html/index.html')
        .pipe(rev())
        .pipe(gulp.dest('dist/html1'));
});
/*
压缩js
*
* */
var uglify = require('gulp-uglify');
gulp.task('jsmin', function () {
    gulp.src(['src/js/index.js','src/js/detail.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

/*
  使用 gulp auto 启动任务
* 检测代码修改自动执行任务
* */

/*
gulp.task('auto', function () {
    gulp.watch('src/js/!*.js',['jsmin']);
});
*/

/*
* 压缩多个js文件
* */

/*
* 合并js
* */
var concat = require('gulp-concat');
gulp.task('testConcat', function () {
    gulp.src('src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));
});

/*
* 定义默认任务
* */
/*
gulp.task('default', ['jsmin', 'auto']);

*/


var less = require('gulp-less');
gulp.task('less', function () {
    gulp.src('src/less/**.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
});

/*
gulp.task('auto', function () {
    gulp.watch('src/less/!**.js',['less']);
});


 gulp.task('default', ['less', 'auto']);

*/



/*
* 测试 输出颜色
* */
var gutil = require('gulp-util');

gulp.task('default', function () {
    gutil.log('message');
    gutil.log(gutil.colors.red('error'));
    gutil.log(gutil.colors.green('message:') + 'some things');
});


/*
* watch 修改文件路径
* */
var watchPath = require('gulp-watch-path');
/*
gulp.task('watchjs', function () {
    gulp.watch('src/js/!**!/!*.js', function (e) {
        var paths = watchPath(e,'src/', 'dist/');
        gutil.log(gutil.colors.green(e.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
    });
});
*/

/*
*  stream-combiner2 捕获错误信息。
* */

var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n');

    gutil.log(colors.red('Error'));
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))

}

var combiner = require('stream-combiner2');

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (e) {
        var paths = watchPath(e,'src/','dist/');

        gutil.log(gutil.colors.green(e.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            uglify(),
            gulp.dest(paths.distDir)
        ])


        combined.on('error',handleError);

    })


});



var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('default', ['watchcss']);