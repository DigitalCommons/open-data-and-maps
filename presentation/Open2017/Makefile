
.PHONY: all clean deploy

SRCS := main.beamer.tex main.article.tex
AUXS := $(SRCS:.tex=.aux)
LOGS := $(SRCS:.tex=.log)
NAVS := $(SRCS:.tex=.nav)
OUTS := $(SRCS:.tex=.out)
PDFS := $(SRCS:.tex=.pdf)
SNMS := $(SRCS:.tex=.snm)
TOCS := $(SRCS:.tex=.toc)
ALL_PDF := $(SRCS:.tex=.pdf)
all: $(ALL_PDF)
$(ALL_PDF): main.tex

deploy: $(ALL_PDF)
	@echo "Need to deploy $(ALL_PDF) to somewhere"

clean:
	-rm $(AUXS) $(LOGS) $(NAVS) $(OUTS) $(PDFS) $(SNMS) $(TOCS)

%.pdf: %.tex
	xelatex $<
