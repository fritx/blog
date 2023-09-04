# 📎 Symlinks vs Hard Links

*2023/09/04*

> Underneath the file system, files are represented by inodes.<br>
A file in the file system is basically a link to an inode.

What is the difference between a symbolic link and a hard link?<br>
https://stackoverflow.com/questions/185899/what-is-the-difference-between-a-symbolic-link-and-a-hard-link

> 1. Hard link points to the file content while Soft link points to the file name.
1. While size of hard link is the size of the content while soft link is having the file name size.
1. Hard links share the same inode. Soft links do not.
1. Hard links can't cross file systems. Soft links do.
1. Hard-links cannot point to directories.
1. More...

> Also: Symbolic links can be copied, version-controlled, ..etc. In another words, they are an actual file. On the other end, a hard link is something at a slightly lower level and you will find that compared to symbolic links, there are less tools that provide means for working with the hard links as hard links and not as normal files.

### An Example

> <img width=400 src=ka2ab.jpg>

> Look what will now happen if `myfile` is deleted (or moved):

```sh
echo aaa > myfile
ln myfile myfile-hard
ln -s myfile myfile-soft

mv myfile myfile-mv
cat myfile-hard
>> aaa
```

> `myfile-hard` still points to the same contents, and is thus unaffected.

#### How is the symbolic link now?

```sh
ll | grep myfile
>>
-rw-r--r--  ... myfile-hard
-rw-r--r--  ... myfile-mv
lrwxr-xr-x  ... myfile-soft -> myfile

cat myfile-soft
>> cat: myfile-soft: No such file or directory
```

`myfile-soft` now can not be read directly as if no such file.

However, it can still be **listed** in under the directory.

### Space: which takes more?

Which uses more space, hardlink or softlink? Why?<br>
https://www.quora.com/Which-uses-more-space-hardlink-or-softlink-Why

> ChatGPT: Hardlinks and softlinks are both file system constructs that allow multiple files to share the same data on a file system. However, they are different in how they store and reference the data. A hardlink is a second name for a file that already exists on the file system. It creates a new pointer to the same inode, which is the data structure that stores the file's metadata such as its permissions, timestamps, and ownership. A hardlink shares the same data blocks with the original file, and it does not take up any additional space on the file system. A softlink (also known as a symbolic link) is a special file that contains a path to another file or directory. It **creates a new inode that stores the path** to the target file or directory, but it does not share the same data blocks. A softlink takes up a small amount of space on the file system, typically just a few bytes, depending on the length of the path. In summary, a hardlink shares the same data blocks with the original file, while a softlink stores a path to the target file or directory, taking up minimal space on the file system.

### Performance: which is faster?

Hard links versus symbolic links: which one is faster / smaller?<br>
https://unix.stackexchange.com/questions/102504/hard-links-versus-symbolic-links-which-one-is-faster-smaller

> 1. Read performance of hard links is better than symbolic links (micro-performance).
1. Once open, whether you use symlinks or hard links doesn't make a difference as far as read/write operations are concerned.

> ChatGPT: **Hard Links**: ... Because all hard links to the same file share the same inode, accessing the file through any of its hard links is equally fast. Hard links don't involve resolving paths or symbolic references, which makes them faster when it comes to access.<br>
**Symbolic (Soft) Links**: ... When you access a symbolic link, the file system needs to resolve the symbolic reference to find the target file or directory. This additional step makes symbolic links slightly slower to access compared to hard links.<br>
However, the speed difference between hard and symbolic links is usually so **minimal** that it's not a significant factor in most use cases. The choice between them depends on other factors such as their behavior and intended purpose. ...

### The "Fast Symlinks" Improvement

Storage of symbolic links - Wikipedia<br>
https://en.wikipedia.org/wiki/Symbolic_link#Storage_of_symbolic_links

> Early implementations of symbolic links stored the symbolic link information as data in regular files. The file contained the textual reference to the link's target, and the file mode bits indicated that the type of the file is a symbolic link.<br>
This method was slow and an inefficient use of disk-space on small systems. An improvement, called fast symlinks, allowed storage of the target path **within the data structures used for storing file information on disk (inodes)**. This space normally stores a list of disk block addresses allocated to a file. Thus, symlinks with short target paths are accessed quickly. Systems with fast symlinks often fall back to using the original method **if the target path exceeds the available inode space**. The original style is retroactively termed a slow symlink. It is also used for disk compatibility with other or older versions of operating systems.

<img width=500 src=maxresdefault.jpg>

Inode Structure<br>
https://www.youtube.com/watch?v=tMVj22EWg6A
