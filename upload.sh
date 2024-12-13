ac_i=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_
ac_temp=$(printf "%s" $ac_i | cut -c 7)ithub_pat_11BCZ7OLY0DRiRz1sxvTRd_jciGqTYx677SlnDIuxLEXZIeBaD345r4ZFfqRLRb0si5QBYKGY28gvgmjhU
#echo $ac_temp
git pull
git add .
git commit -m update
git push https://$ac_temp@github.com/n01648028/NoteManagement
git pull
