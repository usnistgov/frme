/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

var FrictionRidgeMetadataExplorerVars = {
	records: null,
	currentRecordNumber: 0
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Drag and drop support
 ******************************************************************************/

function allowDrop(event)
{
	event.preventDefault();
	event.target.classList.add('highlight');
}

function removeHighlight(event)
{
	event.target.classList.remove('highlight');
}

function drop(event)
{
	event.preventDefault();
	attachFileInput(event.dataTransfer);
	removeHighlight(event);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * C++ helpers/conversions/etc.
 ******************************************************************************/

/** Display alert with an exception message */
function alertException(e)
{
	const msg = getExceptionMessageString(e)
	if (msg === null)
		alert("An unknown error occurred")
	else
		alert(msg);
}

/** Decode exception message, regardless of type of exception */
function getExceptionMessageString(e)
{
	if (e instanceof WebAssembly.Exception) {
		// https://github.com/emscripten-core/emscripten/issues/16033
		// https://github.com/emscripten-core/emscripten/issues/16380
		return getExceptionMessage(e)[1];
	} else if (typeof e === 'number') {
		return Module.getExceptionPtrMessage(e);
	}

	return null
}


/** Obtain human readable version of point system enumeration */
function pointSystemName(ps)
{
	switch (ps) {
	case Module.PointSystem.Legacy:
		return "Legacy";
	case Module.PointSystem.IAFIS:
		return "IAFIS";
	case Module.PointSystem.Cogent:
		return "Cogent";
	case Module.PointSystem.Motorola:
		return "Motorola";
	case Module.PointSystem.Sagem:
		return "Sagem";
	case Module.PointSystem.NEC:
		return "NEC";
	case Module.PointSystem.Identix:
		return "Identix";
	case Module.PointSystem.Other:
		return "User-Defined";
	case Module.PointSystem.M1:
		return "M1";
	case Module.PointSystem.EFS:
		return "EFS"
	}
}

/** Remove uploaded file at `path` */
function removeUpload(path)
{
	FS.unlink(path);
}

/** Display the version number on the page. */
function showVersion()
{
	var versionContainer = document.getElementById("version-container")

	/* If CMake didn't configure the version number, don't show it */
	if (FrictionRidgeMetadataExplorerVersion == "" ||
	    FrictionRidgeMetadataExplorerVersion.includes("@") ||
	    FrictionRidgeMetadataExplorerVersion.includes("$")) {
		versionContainer.classList.append("d-none")
		return
	}

	while (versionContainer.classList.contains("d-none")) {
		versionContainer.classList.remove("d-none")
	}

	var version = document.getElementById("version")
	version.innerHTML = 'git commit <a href="https://github.com/' +
	    "usnistgov/frme/commit/" + FrictionRidgeMetadataExplorerVersion +
	    '" target="_blank" class="link-underline-light link-secondary" >' +
	    FrictionRidgeMetadataExplorerVersion + "</a>"
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Interface elements
 ******************************************************************************/

/**
 * @brief
 * Create a modal dialog and add it to the DOM.
 *
 * @param headline
 * Title of the modal
 * @param text
 * Body text
 * @param scrollable
 * true if `text` should scroll, false if the entire modal should scroll
 *
 * @return
 * ID of the modal that was added to the DOM.
 *
 * @note
 * `headline` and `text` can accept HTML.
 */
function generateModal(headline, text, scrollable = false)
{
	const uniqueID = Date.now()

	var modal = document.createElement("div")
	modal.id = "modal-" + uniqueID
	modal.classList.add("modal", "fade")
	modal.setAttribute("tabindex", "-1")
	modal.setAttribute("aria-labelledby", "modalLabel-" + uniqueID)
	modal.setAttribute("aria-hidden", "true")

	var dialog = document.createElement("div")
	dialog.classList.add("modal-dialog", "modal-dialog-centered")
	if (scrollable)
		dialog.classList.add("modal-dialog-scrollable")

	var content = document.createElement("div")
	content.classList.add("modal-content")

	var header = document.createElement("div")
	header.classList.add("modal-header")

	var title = document.createElement("h1")
	title.classList.add("modal-title", "fs-5")
	title.id = "modalLabel-" + uniqueID
	title.innerHTML = headline

	var closeInHeader = document.createElement("button")
	closeInHeader.classList.add("btn-close")
	closeInHeader.setAttribute("type", "button")
	closeInHeader.setAttribute("data-bs-dismiss", "modal")
	closeInHeader.setAttribute("aria-label", "Close")

	var body = document.createElement("div")
	body.classList.add("modal-body")
	body.innerHTML = text

	var footer = document.createElement("div")
	footer.classList.add("modal-footer")

	var closeInFooter = document.createElement("button")
	closeInFooter.classList.add("btn", "btn-primary")
	closeInFooter.setAttribute("type", "button")
	closeInFooter.setAttribute("data-bs-dismiss", "modal")
	closeInFooter.textContent = "Close"

	footer.appendChild(closeInFooter)
	header.appendChild(title)
	header.appendChild(closeInHeader)
	content.appendChild(header)
	content.appendChild(body)
	content.appendChild(footer)
	dialog.appendChild(content)
	modal.appendChild(dialog)

	document.getElementById("results_container").appendChild(modal)

	return ("modal-" + uniqueID)
}

/**
 * @brief
 * Create a modal dialog and add it to the DOM.
 *
 * @param link_text
 * Clickable text for a link that will launch the modal.
 * @param headline
 * Title of the modal
 * @param text
 * Body text
 * @param scrollable
 * true if `text` should scroll, false if the entire modal should scroll
 *
 * @return
 * Object with elements `link` (containing anchor not in the DOM) and `id`
 * containing the ID of the modal that has been added to the DOM.
 *
 * @note
 * `headline` and `text` can accept HTML.
 *
 * @seealso generateModal
 */
function generateModalWithLink(link_text, headline, body,
    scrollable = false)
{
	const modalID = generateModal(headline, body, scrollable)

	var ahref = '<a href="#' + modalID + '" data-bs-toggle="modal" ' +
	    'data-bs-target="#' + modalID + '">' + link_text + '</a>'

	return { link: ahref, id: modalID };
}

/******************************************************************************
 * Image placeholder
 ******************************************************************************/

/** Hides the "No Image" image */
function removeImagePlaceholder()
{
	// Un-hide the canvas
	var canvas = document.getElementById("decoded_image")
	if (canvas.classList.contains("d-none"))
		canvas.classList.remove("d-none")

	// Remove the placeholder image
	var placeholder = document.getElementById("placeholderRect")
	if (placeholder != null)
		placeholder.remove()
}

/** Shows the "No Image" image */
function addImagePlaceholder()
{
	// Hide the canvas
	var canvas = document.getElementById("decoded_image")
	if (!canvas.classList.contains("d-none"))
		canvas.classList.add("d-none")

	// Add placeholder image
	if (document.getElementById('placeholderRect'))
		return;

	const placeholderRect=`
	<svg class="mx-auto d-block" width="500" height="500"
	    xmlns="http://www.w3.org/2000/svg" role="img"
	    aria-label="Placeholder image" preserveAspectRatio="xMidYMid slice"
	    focusable="false">
		<title>Placeholder image</title>
		<rect x="0" y="0" width="100%" height="100%" fill="#868e96">
		</rect>
		<text x="50%" y="48%" fill="#dee2e6" dominant-baseline="middle"
		    text-anchor="middle">No Image</text>
		<text x="50%" y="52%" fill="#dee2e6" dominant-baseline="middle"
		    text-anchor="middle">(Features Only)</text>
	</svg>`

	var placeholder = document.createElement('div')
	placeholder.id = 'placeholderRect'
	placeholder.innerHTML = placeholderRect;

	const imageCol = document.getElementById("imageColumn")
	imageCol.prepend(placeholder)
}

/******************************************************************************
 * Offline alert dialog
 ******************************************************************************/

/** Shows the "works offline" alert if it hasn't been shown before */
function showOfflineAlert()
{
	if (localStorage.getItem("showOfflineAlert") != null) {
		document.getElementById("offlineAlert").classList.add("d-none");
	}
}

/** Triggered when user dismisses the "works offline" alert. */
function offlineAlertClosed()
{
	localStorage.setItem("showOfflineAlert", false);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Drawing
 ******************************************************************************/

/** Things to do when the page initially loads. */
function onInitialPageLoad()
{
	showOfflineAlert()
	showVersion()
}

/** Reset interface to unused state */
function resetInterface()
{
	FrictionRidgeMetadataExplorerVars.records = null;
	FrictionRidgeMetadataExplorerVars.currentRecordNumber = 0;

	document.getElementById("file_selector").value = null;

	document.getElementById('decoded_image').height = 0;

	document.getElementById("results_container").classList.
	    add("d-none");
	showOfflineAlert();

	var statusBlock = document.getElementById('status_message');
	while (statusBlock.firstChild) {
		statusBlock.removeChild(statusBlock.firstChild)
	}

	var recordNumberBlock = document.getElementById("recordNumberBlock");
	while (recordNumberBlock.firstChild)
		recordNumberBlock.removeChild(recordNumberBlock.firstChild)
}

/**
 * Scale a canvas and all of its content.
 *
 * @note
 * https://stackoverflow.com/a/34867213/
 */
function resizeTo(canvas,pct){
	var tempCanvas=document.createElement("canvas");
	var tctx=tempCanvas.getContext("2d");

	var cw=canvas.width;
	var ch=canvas.height;
	tempCanvas.width=cw;
	tempCanvas.height=ch;
	tctx.drawImage(canvas,0,0);
	canvas.width*=pct;
	canvas.height*=pct;
	var ctx=canvas.getContext('2d');
	ctx.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);
}

/**
 * @brief
 * Draw minutia on a canvas
 *
 * @param ctx
 * canvas 2d context
 * @param points
 * WASM std::vector<PointShim>
 */
function drawMinutiae(ctx, points)
{
	const radius = 4
	const halfRadius = radius / 2

	function deg2Rad(d) { return (d * (Math.PI / 180)) }

	for (var i = 0; i < points.size(); ++i) {
		const p = points.get(i)
		var drawAngle = true;
		ctx.beginPath()
		if (p.type == Module.MinutiaeType.RidgeEnding) {
			ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
			ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
		} else if (p.type == Module.MinutiaeType.Bifurcation) {
			ctx.fillStyle = "rgba(0, 0, 255, 0.5)"
			ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"
		} else {
			ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
			ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
			drawAngle = false;
		}

		const cx = p.x - halfRadius;
		const cy = p.y - halfRadius;

		ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
		ctx.fill()

		// Angle
		if (drawAngle) {
			const length = 12;
			ctx.beginPath();
			ctx.moveTo(cx, cy);
			ctx.lineTo(
			    cx + (length * Math.cos(deg2Rad(-p.angle))),
			    cy + (length * Math.sin(deg2Rad(-p.angle))));
			ctx.stroke();
		}
	}
}

/** Draw fingerprint image and minutia overtop (if any) */
function drawImageThenMinutiae(canvas, context, points)
{
	const MAX_DIMENSION = 500

	var image = new Image();
	image.onload = function() {
		canvas.width = image.width
		canvas.height = image.height

		context.drawImage(image, 0, 0, image.width, image.height, 0, 0,
		    canvas.width, canvas.height);
		if (points != null)
			drawMinutiae(context, points)

		if (image.width > MAX_DIMENSION || image.height > MAX_DIMENSION)
			resizeTo(canvas, 0.01 * (100 /
			    (Math.max(image.width, image.height) /
			    MAX_DIMENSION)))
	};

	return image;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Record display
 ******************************************************************************/

/** Builds an HTML element that can change the image display from the file */
function configureRecordNumberChooser()
{
	var recordNumberBlock = document.getElementById("recordNumberBlock");
	while (recordNumberBlock.firstChild)
		recordNumberBlock.removeChild(recordNumberBlock.firstChild)

	// Don't need this to display if there's only a single record
	if (FrictionRidgeMetadataExplorerVars.records.size() == 1)
		return;

	var select = document.createElement("select");
	select.id = "recordNumberSelector"
	select.setAttribute("onchange", "updateRecordNumber()");

	for (var i = 1; i <= FrictionRidgeMetadataExplorerVars.records.size();
	    ++i) {
		var option = document.createElement("option")
		option.value = i
		option.text = i
		select.appendChild(option)
	}
	select.classList.add("form-select")
	select.classList.add("form-select-sm")
	// Bootstrap style for select is 100% block
	select.style["display"] = "inline";
	select.style["width"] = "unset";

	var span1 = document.createElement("span")
	span1.textContent = "Viewing image "
	span1.classList.add("small")

	var span2 = document.createElement("span")
	span2.appendChild(select)

	var span3 = document.createElement("span")
	span3.textContent += " of " +
	    FrictionRidgeMetadataExplorerVars.records.size()
	span3.classList.add("small")

	recordNumberBlock.appendChild(span1)
	recordNumberBlock.appendChild(span2)
	recordNumberBlock.appendChild(span3)
}

/** Triggered when the image selection popover is changed */
function updateRecordNumber()
{
	FrictionRidgeMetadataExplorerVars.currentRecordNumber =
	    parseInt(document.getElementById("recordNumberSelector").value) - 1
	console.debug("Changing to record number " +
	    FrictionRidgeMetadataExplorerVars.currentRecordNumber)
	displayRecords(FrictionRidgeMetadataExplorerVars.records,
	    FrictionRidgeMetadataExplorerVars.currentRecordNumber)
}

/**
 * @brief
 * Display a record from a set of records
 *
 * @param records
 * Set of records [(image, metadata) pairs]
 * @param recordNumber
 * The element in `records` to display
 *
 * @seealso displayRecord()
 */
function displayRecords(records, recordNumber)
{
	console.log("About to display record #" + recordNumber)
	displayRecord(records.get(recordNumber));
}

/** Draws the image from `record` on the page */
function displayRecord(record)
{
	// Grab the canvas, and have it draw images when applied
	var canvas = document.getElementById("decoded_image");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const minRecs = record.minutiaeDataRecords;
	if (minRecs.size() != 0) {
		if (!record.image.containsImage()) {
			console.debug("Hiding image for min-only record")
			addImagePlaceholder()
			return;
		} else {
			removeImagePlaceholder();
		}

		const allPointSets = Module.getAllPoints(record.image, minRecs);
		if (allPointSets.size() != 0) {
			console.debug("Drawing minutia points for " +
			    pointSystemName(allPointSets.get(0).system))

			var image = drawImageThenMinutiae(canvas, ctx,
			    allPointSets.get(0).points);
			image.src = record.image.getBase64PNG(true);
		} else {
			console.debug("No minutiae in point sets to draw")

			var image = drawImageThenMinutiae(canvas, ctx, null);
			image.src = record.image.getBase64PNG(true);
		}
	} else {
		console.debug("No min data records to draw")
		var image = drawImageThenMinutiae(canvas, ctx, null);
		image.src = record.image.getBase64PNG(true);
	}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Summary generators
 ******************************************************************************/

/**
 * @brief
 * Summarize the fingerprint metadata encodings into an interface element.
 *
 * @return
 * "Card" that can be added to the DOM.
 */
function generateSummaryText(an2k)
{
	const legacyIcon = "sunset";
	const warningIcon = "dash-circle";
	const errorIcon = "exclamation-triangle";
	const goodIcon = "check-circle";

	const proprietaryPointTypes = [Module.PointSystem.IAFIS,
	    Module.PointSystem.Cogent,
	    Module.PointSystem.Motorola,
	    Module.PointSystem.Sagem,
	    Module.PointSystem.NEC,
	    Module.PointSystem.Other,
	    Module.PointSystem.Identix];

	const hasEFS = Module.hasMinutiaeDataFormat(an2k,
	    Module.PointSystem.EFS)
	const hasLegacy = Module.hasMinutiaeDataFormat(an2k,
	    Module.PointSystem.Legacy)
	const hasM1 = Module.hasMinutiaeDataFormat(an2k,
	    Module.PointSystem.M1)
	const hasOpen = hasLegacy || hasM1 || hasEFS;
	const hasLessDesirableOpen = hasLegacy || hasM1;

	var hasProprietary = false;
	for (let i = 0; i < proprietaryPointTypes.length; ++i) {
		if (Module.hasMinutiaeDataFormat(an2k,
		    proprietaryPointTypes[i])) {
			hasProprietary = true
			break
		}
	}

	const hasFRImages = Module.hasFrictionRidgeImagery(an2k)
	const hasFRMetadata = hasProprietary || hasOpen

	//----------------------------------------------------------------------

	var content_type = ""
	if (hasProprietary) {
		if (hasOpen) {
			content_type = "proprietary_and_open"
		} else {
			content_type = "proprietary"
		}
	} else if (hasEFS) {
		if (hasLessDesirableOpen) {
			content_type = "efs_and_legacy"
		} else {
			content_type = "efs"
		}
	} else if (hasLessDesirableOpen) {
		content_type = "other_open"
	} else {
		if (hasFRImages) {
			content_type = "image"
		} else {
			content_type = "unknown"
		}
	}

	const color = FRME_EXPLANATIONS.short[content_type].color
	const icon = FRME_EXPLANATIONS.short[content_type].icon
	const header = FRME_EXPLANATIONS.short[content_type].header
	var headline = FRME_EXPLANATIONS.short[content_type].summary
	var subhead = FRME_EXPLANATIONS.short[content_type].details

	const modalInfo = generateModalForExplanationWithLink("Learn more...",
	    content_type, true)
	if (modalInfo != null) {
		if (subhead == null || subhead == "")
			headline += ' ' + modalInfo.link
		else
			subhead += ' ' + modalInfo.link
	}

	//
	// Generate a "Card"
	//
	var card = document.createElement('div')
	card.classList.add("card", "bg-" + color + "-subtle", "border-" +
	    color + "-subtle", "text-" + color + "-emphasis")

	var cardHeader = document.createElement('div')
	cardHeader.classList.add("card-header", "fw-semibold")
	cardHeader.innerHTML = '<i class="bi bi-' + icon + '"></i> ' + header
	card.appendChild(cardHeader)

	var cardBody = document.createElement('div')
	cardBody.classList.add("card-body")

	var cardTextHeadline = document.createElement('p')
	cardTextHeadline.classList.add("card-text")
	cardTextHeadline.innerHTML = headline
	cardBody.appendChild(cardTextHeadline)

	if (subhead != "") {
		var cardTextSubheadline = document.createElement('p')
		cardTextSubheadline.classList.add("card-text", "fw-light",
		    "small")
		cardTextSubheadline.innerHTML = subhead
		cardBody.appendChild(cardTextSubheadline)
	}

	card.appendChild(cardBody)

	return (card)
}

/**
 * @brief
 * Summarize the fingerprint metadata encodings into an HTMLtable.
 *
 * @return
 * Table that can be added to the DOM.
 */
function generatePointSystemTypeTable(an2k)
{
	const pointTypes = [Module.PointSystem.Legacy,
	    Module.PointSystem.IAFIS,
	    Module.PointSystem.Cogent,
	    Module.PointSystem.Motorola,
	    Module.PointSystem.Sagem,
	    Module.PointSystem.NEC,
	    Module.PointSystem.Identix,
	    Module.PointSystem.M1,
	    Module.PointSystem.Other,
	    Module.PointSystem.EFS];

	const proprietaryPointTypes = [Module.PointSystem.IAFIS,
	    Module.PointSystem.Cogent,
	    Module.PointSystem.Motorola,
	    Module.PointSystem.Sagem,
	    Module.PointSystem.NEC,
	    Module.PointSystem.Identix,
	    Module.PointSystem.Other];

	const hasEFS = Module.hasMinutiaeDataFormat(an2k,
	    Module.PointSystem.EFS)
	const hasLegacy = Module.hasMinutiaeDataFormat(an2k,
	    Module.PointSystem.Legacy)
	const hasM1 = Module.hasMinutiaeDataFormat(an2k,
	    Module.PointSystem.M1)
	const hasOpen = hasLegacy || hasM1 || hasEFS;

	var hasProprietary = false;
	for (let i = 0; i < proprietaryPointTypes.length; ++i) {
		if (Module.hasMinutiaeDataFormat(an2k,
		    proprietaryPointTypes[i])) {
			hasProprietary = true
			break
		}
	}

	const hasFRImages = Module.hasFrictionRidgeImagery(an2k)
	const hasFRMetadata = hasProprietary || hasOpen

	var table = document.createElement("table");
	table.className = "table table-striped";
	table.id = "featureSetTable"
	var thead = table.createTHead();
	var tr = thead.insertRow();
	var td = document.createElement('th')
	td.scope = "col"
	td.innerText = "Metadata Type";
	tr.appendChild(td)

	td = document.createElement('th')
	td.scope = "col"
	td.colSpan = "2"
	td.innerText = "Present?";
	tr.appendChild(td)

	var tbody = table.createTBody();
	for (let i = 0; i < pointTypes.length; ++i) {
		const type = pointTypes[i];

		tr = tbody.insertRow()
		td = tr.insertCell();
		td.appendChild(document.createTextNode(pointSystemName(type)));
		td = tr.insertCell();

		const hasType = Module.hasMinutiaeDataFormat(an2k, type)
		td.appendChild(document.createTextNode(hasType ? "Yes" : "No"));

		var styles = FRME_EXPLANATIONS.table.proprietary.omitted;

		if (!hasFRMetadata) {
			styles = FRME_EXPLANATIONS.table.no_data
		// EFS row and you have EFS
		} else if (hasType && type == Module.PointSystem.EFS) {
			styles = FRME_EXPLANATIONS.table.efs.present
		// Legacy row and you have legacy
		} else if (hasType && type == Module.PointSystem.Legacy) {
			styles = FRME_EXPLANATIONS.table.legacy.present
		// Legacy row and you don't have legacy
		} else if (!hasType && type == Module.PointSystem.Legacy) {
			styles = FRME_EXPLANATIONS.table.legacy.present

			// ...but you do have M1 or EFS
			if (hasM1 || hasEFS) {
				styles =
				    FRME_EXPLANATIONS.table.legacy.open_present
			// ...and you don't have any interoperable encodings
			} else {
				styles = FRME_EXPLANATIONS.table.legacy.omitted
			}
		// M1 row and you have M1
		} else if (hasType && type == Module.PointSystem.M1) {
			styles = FRME_EXPLANATIONS.table.open.present
		// M1 row and you don't have M1
		} else if (!hasType && type == Module.PointSystem.M1) {
			styles = FRME_EXPLANATIONS.table.open.present

			// ...but you do have legacy
			if (hasLegacy) {
				styles =
				    FRME_EXPLANATIONS.table.open.legacy_present
			// ...but you do have EFS
			} else if (hasEFS) {
				styles = FRME_EXPLANATIONS.table.open.
				    efs_present
			// ...and you don't have any interoperable encodings
			} else {
				styles = FRME_EXPLANATIONS.table.open.omitted
			}
		// EFS row and you don't have EFS
		} else if (!hasType && type == Module.PointSystem.EFS) {
			// ...but you do have legacy
			if (hasLegacy || hasM1) {
				if (hasProprietary)
					styles =
					    FRME_EXPLANATIONS.table.efs.omitted
				else
					styles =
					    FRME_EXPLANATIONS.table.efs.
					    open_present
			// ...and you have proprietary
			} else if (hasProprietary) {
				styles = FRME_EXPLANATIONS.table.efs.omitted
			//
			} else {
				styles = FRME_EXPLANATIONS.table.no_data
			}
		// Proprietary row and you have it
		} else if (hasType) {
			styles = FRME_EXPLANATIONS.table.proprietary.present
		// Proprietary row and you don't have it
		} else if (!hasType) {
			styles = FRME_EXPLANATIONS.table.proprietary.omitted
		}

		tr.className = "table-" + styles.table_color;

		td = tr.insertCell();
		td.innerHTML = '<a href="#" class="disabled link-' +
		    styles.icon_color + '" data-bs-toggle="tooltip" ' +
		    'data-bs-title="' + styles.message + '"><i class="bi bi-' +
		    styles.icon + '"></i></a>';
	}

	var accordion = document.createElement("div")
	accordion.classList.add("accordion")
	accordion.id = "accordionParent"

	var accordionHead = document.createElement("h2")
	accordionHead.classList.add("accordion-header")

	var button = document.createElement("button")
	button.classList.add("accordion-button", "collapsed")
	button.setAttribute("type", "button")
	button.setAttribute("data-bs-toggle", "collapse")
	button.setAttribute("data-bs-target", "#featureSetTableAccordion")
	button.setAttribute("aria-expanded", "false")
	button.setAttribute("aria-controls", "featureSetTableAccordion")
	button.innerText = "Summary of Feature Blocks"
	accordionHead.appendChild(button)

	var collapsableContent = document.createElement("div")
	collapsableContent.classList.add("accordion-collapse", "collapse")
	collapsableContent.setAttribute("data-bs-parent", "#accordionParent")
	collapsableContent.id = "featureSetTableAccordion"

	var accordionBody = document.createElement("div")
	accordionBody.classList.add("accordion-body")
	accordionBody.appendChild(table)
	collapsableContent.appendChild(accordionBody)

	var accordionItem = document.createElement("div")
	accordionItem.classList.add("accordion-item")
	accordionItem.appendChild(accordionHead)
	accordionItem.appendChild(collapsableContent)

	accordion.appendChild(accordionItem)

	return (accordion)
}

/**
 * @brief
 * Generates a link to "long" explanation modal dialog
 *
 * @param link_text
 * Clickable text for the link to open the modal
 * @param explanation
 * Key from "long" in the explanations source
 * @param scrollable
 * true if content is scrollable, false if page is scrollable
 *
 * @return
 * Link that launches a modal containing long explanation.
 */
function generateModalForExplanationWithLink(link_text, explanation,
    scrollable = false)
{
	if (!FRME_EXPLANATIONS["long"][explanation].show_link)
		return (null)

	return (generateModalWithLink(link_text,
	    FRME_EXPLANATIONS["long"][explanation].headline,
	    FRME_EXPLANATIONS["long"][explanation].body, scrollable))
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/*******************************************************************************
 * File upload
*******************************************************************************/

/** On file upload, process and display the record */
function attachFileInput(fileInput) {
	const uploadedImageFileName = 'UPLOAD';
	const uploadedFilePath = '/' + uploadedImageFileName;

	if (fileInput.files.length == 0)
		return;
	var file = fileInput.files[0];

	var fr = new FileReader();
	fr.onload = function () {
		resetInterface();

		// Save the file
		const data = new Uint8Array(fr.result);
		FS.createDataFile('/', uploadedImageFileName, data, true,
		    false, true);

		// Check if it is ANSI/NIST-ITL
		if (!Module.AN2K.isAN2K(uploadedFilePath)) {
			removeUpload(uploadedFilePath);
			alert("This file does not appear to be formatted as " +
			    "ANSI/NIST-ITL.");
			return;
		}

		// Try to parse the file
		try {
			console.time('Parsing ANSI/NIST-ITL file');
			var an2k = new Module.AN2K(uploadedFilePath);
			console.timeEnd('Parsing ANSI/NIST-ITL file');
		} catch (e) {
			removeUpload(uploadedFilePath);
			alertException(e);
			return;
		}

		var statusMessage = document.getElementById('status_message')
		statusMessage.appendChild(generateSummaryText(an2k))
		statusMessage.appendChild(document.createElement("br"))
		statusMessage.appendChild(generatePointSystemTypeTable(an2k))

		// Enable popovers (after adding table to the DOM)
		const popoverTriggerList =
		    document.querySelectorAll('[data-bs-toggle="popover"]')
		const popoverList = [...popoverTriggerList].map(
		    popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
		const tooltipTriggerList =
		    document.querySelectorAll('[data-bs-toggle="tooltip"]')
		const tooltipList = [...tooltipTriggerList].map(
		    tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

		console.time('Parsing records');
		try {
			FrictionRidgeMetadataExplorerVars.records =
			    Module.getFrictionRidgeImagesWithMinutiaeData(an2k);
		} catch (e) {
			an2k.delete()
			removeUpload(uploadedFilePath)
			alertException(e);
			return;
		}
		console.timeEnd('Parsing records');
		an2k.delete();
		removeUpload(uploadedFilePath)

		console.debug(FrictionRidgeMetadataExplorerVars.records.size() +
		    " elements")

		if (FrictionRidgeMetadataExplorerVars.records.size() > 0) {
			removeImagePlaceholder()

			console.time('Updating display');
			displayRecord(FrictionRidgeMetadataExplorerVars.records.
			    get(FrictionRidgeMetadataExplorerVars.
			    currentRecordNumber));
			configureRecordNumberChooser()
			console.timeEnd('Updating display');
		} else {
			addImagePlaceholder();
		}



		var resultsContainer = document.getElementById(
		    "results_container")
		while (resultsContainer.classList.contains("d-none"))
			resultsContainer.classList.remove("d-none")
	};
	fr.readAsArrayBuffer(file);
}
