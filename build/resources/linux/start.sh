#!/bin/bash

# This is a fix for NW.js applications which fail to run because of
# the missing libudev library version on some linux distributions
# https://github.com/nwjs/nw.js/wiki/The-solution-of-lacking-libudev.so.0

# name of the executable
EXEC="livestreamer-twitch-gui"
# enable/disable new version check
CHECKNEWVERSIONS=true


########


DIR=`readlink -f $0`
HERE=`dirname $DIR`

# check for the missing libudev library version
if [[ ! -z `ldd $HERE/$EXEC | grep "libudev.so.0 => not found"` ]]; then

	# check for an existing softlink
	if [[ ! -e "$HERE/libudev.so.0" ]]; then
		PATHS=(
			"/lib/x86_64-linux-gnu" # Ubuntu, Xubuntu, Mint
			"/usr/lib64" # SUSE, Fedora
			"/lib64" # Gentoo
			"/lib/i386-linux-gnu" # Ubuntu 32bit
			"/usr/lib" # Arch, Fedora 32bit
			"/lib32" # Gentoo 32bit
			"/usr/lib32" # Gentoo 32bit alternative
		)
		for i in "${PATHS[@]}"; do
			i="$i/libudev.so.1"
			if [[ -f $i ]]; then
				# create the softlink to the needed library
				ln -sf "$i" $HERE/libudev.so.0
				break
			fi
		done
	fi

	# prioritize to load the linked library from this directory
	if [[ -n "$LD_LIBRARY_PATH" ]]; then
		LD_LIBRARY_PATH="$HERE:$LD_LIBRARY_PATH"
	else
		LD_LIBRARY_PATH="$HERE"
	fi
	export LD_LIBRARY_PATH

fi


# application parameters
[[ $CHECKNEWVERSIONS = true ]] && params="$@" || params="$@ --no-version-check"


# run the application
exec -a "$0" "$HERE/$EXEC" $params &
pid=$!

# fix application name in gnome panel
# consider for: GNOME / Unity / KDE / XFCE / X-Cinnamon / LXDE
# useful also for cairo-dock, gnome dash-to-dock, and plank/docky
if ( [[ "$XDG_CURRENT_DESKTOP" = "GNOME" ]] && [[ ! -z `which wmctrl` ]] ); then
	sleep 1
	while [ -z $winid ]
	do
		sleep 1
		winid=$(wmctrl -lpx | grep $pid | cut -d' ' -f 1)
	done
	xprop -id ${winid} -f WM_CLASS 8s -set WM_CLASS "Livestreamer Twitch GUI"
fi

wait $pid
