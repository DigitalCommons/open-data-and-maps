
.PHONY: all

SRCS := main.beamer.tex main.article.tex
ALL_PDF := $(SRCS:.tex=.pdf)
$(ALL_PDF): main.tex
all: $(ALL_PDF)

%.pdf: %.tex
	xelatex $<
