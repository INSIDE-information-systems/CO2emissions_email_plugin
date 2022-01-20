DIST="dist"
VERSION=$(grep \"version\" manifest.json | cut -d \" -f 4)
NAME="estimez_votre_co2-$VERSION-tb.xpi"

mkdir -p $DIST
rm -f $DIST/$NAME
zip -r $DIST/$NAME images/ preferences/ scripts/ style/ manifest.json popup.html