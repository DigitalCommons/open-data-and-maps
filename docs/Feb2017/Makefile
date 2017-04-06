SHELL := /bin/bash
.PHONY: all clean spellcheck acceptspellings

SRCS := ISE-data-to-feb-2017.tex
AUXS := $(SRCS:.tex=.aux)
LOGS := $(SRCS:.tex=.log)
NAVS := $(SRCS:.tex=.nav)
OUTS := $(SRCS:.tex=.out)
PDFS := $(SRCS:.tex=.pdf)
SNMS := $(SRCS:.tex=.snm)
TOCS := $(SRCS:.tex=.toc)
ALL_PDF := $(SRCS:.tex=.pdf)
all: $(ALL_PDF)
$(ALL_PDF): map-app-popup-screenshot.png 5-star-steps.png ise-logo.jpg

UNKNOWN_WORDS := hunspell -l -t -i utf-8
ACCEPTED_UNKNOWNS := accepted-spellings.sorted.txt

spellcheck:
	@echo "Words in $(SRCS) that are neither in a standard dictionary nor the previously accepted words in $(ACCEPTED_UNKNOWNS)":
	-@diff --new-line-format="" --unchanged-line-format="" <($(UNKNOWN_WORDS) $(SRCS) | sort -u) $(ACCEPTED_UNKNOWNS)

# acceptspellings will merge the new unknown words with the existing ones (from ACCEPTED_UNKNOWNS) and 
# create a new version of ACCEPTED_UNKNOWNS.
acceptspellings:
	@echo "Saving words not in dictionary to $(ACCEPTED_UNKNOWNS)."
	@echo "You can delete any words that should not be accepted from there."
	$(UNKNOWN_WORDS) $(SRCS) | cat - $(ACCEPTED_UNKNOWNS) | sort -u > $(ACCEPTED_UNKNOWNS)

clean:
	-rm $(AUXS) $(LOGS) $(NAVS) $(OUTS) $(PDFS) $(SNMS) $(TOCS)

# run xelatex twice in order to get cross refs resolved.
%.pdf: %.tex
	xelatex $<
	xelatex $<
